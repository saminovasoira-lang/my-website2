DURBEK AI — WINDOWS UCHUN ISHGA TUSHIRISH

Kerak bo'ladi:
- Windows 10 yoki 11
- Python
- Ollama
- Internet (birinchi marta dasturlar va AI modelini yuklash uchun)

1. Ollama o'rnatish
Rasmiy sahifa: https://ollama.com/download
Windows installer'ni yuklab o'rnating.

2. AI modelini yuklash
Windows Start menyusidan PowerShell yoki VS Code Terminal'ni oching va yozing:

ollama run qwen3.5:2b

Model yuklanishini kuting. Birinchi marta bir necha GB yuklanadi.
Model bilan terminalda suhbatlashish mumkin. Durbek AI saytini ishga tushirish uchun terminalga /bye yozing yoki boshqa terminal oching. Ollama dasturi fon rejimida ishlashi kerak.

3. Python o'rnatish
https://www.python.org/downloads/ sahifasidan Python 3.11 yoki yangirog'ini o'rnating.
O'rnatishda "Add Python to PATH" belgisini qo'yish tavsiya qilinadi.

4. Loyiha papkasini ochish
Zip faylni chiqarib oling. VS Code'da durbek-ai papkasini oching.

5. VS Code Terminal'ni oching
Terminal > New Terminal menyusini tanlang. Quyidagilarni navbat bilan kiriting:

python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python app.py

Agar PowerShell aktivatsiyani bloklasa, aktivatsiya buyrug'ini o'tkazib yuboring va quyidagini ishlating:
python -m pip install -r requirements.txt
python app.py

6. Saytni ochish
Brauzerda quyidagi manzilni oching:
http://127.0.0.1:5000

Muhim:
- Sayt va AI modeli sizning kompyuteringizda ishlaydi.
- Ollama o'rnatilgan bo'lishi va ishlashi kerak.
- Kompyuter o'chirilsa, sayt ham ishlamaydi.
- Model yuklangandan keyin odatiy suhbat uchun internet shart emas.
- Modelning javob sifati va tezligi kompyuter resurslariga bog'liq.
- Bu hozircha lokal prototip; internetga hammaga ochiq joylashtirish uchun xavfsizlik, cheklovlar va hostingni alohida sozlash kerak.
