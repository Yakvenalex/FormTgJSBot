from decouple import config
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import httpx

app = FastAPI()

# Настройка статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# Настройка шаблонов
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/send-data/")
async def send_data(form_data: dict):
    bot_token = config('BOT_TOKEN')
    chat_id = config('CHAT_ID')
    api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    message = f"""
📩 Вам новая заявка:
<b>Имя:</b> {form_data['firstName']}
<b>Фамилия:</b> {form_data['lastName']}
<b>Дата рождения:</b> {form_data['birthDate']}
<b>Пол:</b> {'Мужской' if form_data['gender'] == 'male' else 'Женский'}
<b>Хобби:</b> {', '.join(form_data['hobbies'])}
<b>Примечание:</b> {form_data.get('notes', 'Не указано')}
    """

    params = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(api_url, json=params)
        return {"ok": response.status_code == 200}
