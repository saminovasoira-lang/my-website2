from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
MODEL_NAME = "qwen3.5:2b"

SYSTEM_PROMPT = """
Sen Durbek AI nomli foydali, muloyim va aniq javob beradigan sun'iy intellekt yordamchisisan.
Foydalanuvchi qaysi tilda yozsa, odatda shu tilda javob ber. O'zbekcha savollarga sodda va tabiiy o'zbek tilida javob ber.
Bilmagan narsangni bilaman deb ko'rsatma. Kerak bo'lsa, javobing taxmin ekanini ayt.
Dasturlashni tushuntirganda kodni tartibli va tushunarli yoz.
"""


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages", [])

    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "Xabar topilmadi. Qaytadan yozib ko'ring."}), 400

    # So'nggi xabarlarni yuboramiz, suhbat juda kattalashib ketmasin.
    safe_messages = []
    for item in messages[-20:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role in ("user", "assistant") and isinstance(content, str) and content.strip():
            safe_messages.append({"role": role, "content": content[:6000]})

    if not safe_messages or safe_messages[-1]["role"] != "user":
        return jsonify({"error": "Oxirgi xabar foydalanuvchi xabari bo'lishi kerak."}), 400

    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + safe_messages,
        "stream": False,
        "options": {"temperature": 0.7}
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=180)
        response.raise_for_status()
        result = response.json()
        answer = result.get("message", {}).get("content", "").strip()

        if not answer:
            return jsonify({"error": "AI bo'sh javob qaytardi. Yana urinib ko'ring."}), 502

        return jsonify({"reply": answer})

    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Ollama ishga tushmagan ko'rinadi. Ollama dasturini oching va terminalda modelni ishga tushiring: ollama run qwen3.5:2b"
        }), 503
    except requests.exceptions.Timeout:
        return jsonify({
            "error": "AI javobi juda uzoq davom etdi. Biroz kutib, yana urinib ko'ring."
        }), 504
    except requests.exceptions.HTTPError:
        detail = ""
        try:
            detail = response.json().get("error", "")
        except Exception:
            pass
        return jsonify({
            "error": "Ollama xatosi. Model o'rnatilganini tekshiring: ollama run qwen3.5:2b. " + detail
        }), 502
    except Exception:
        app.logger.exception("Kutilmagan xato")
        return jsonify({"error": "Kutilmagan xato yuz berdi. Terminaldagi xabarni tekshiring."}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
    
    from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
