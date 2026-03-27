# 🌿 Природні Мандри — Backend

Це серверна частина платформи Природні Мандри, побудована на **Node.js** та **Express**. Проєкт забезпечує безпечну авторизацію, роботу з базою даних MongoDB та менеджмент медіа-файлів.

---

## 🛠 Технологічний стек

Проєкт використовує сучасні інструменти для побудови безпечного та масштабованого REST API:

### 🌐 Core

- **[Express 5](https://expressjs.com/)** — швидкий та мінімалістичний фреймворк.

- **[Mongoose](https://mongoosejs.com/)** — ODM для роботи з MongoDB Atlas.

- **[Node.js](https://nodejs.org/en)** — середовище виконання.

### 🔐 Безпека та Авторизація

- **[JWT (JSON Web Tokens)](https://www.npmjs.com/package/jsonwebtoken)** — авторизація за допомогою токенів.

- **httpOnly Cookies** — безпечне зберігання сесії, захищене від XSS атак.

- **[bcrypt](https://www.npmjs.com/package/bcrypt)** — надійне хешування паролів користувачів.

- **[CORS](https://www.npmjs.com/package/cors)** — налаштування дозволених джерел запитів (порт 3000).

### ⚙️ Менеджмент даних та файлів

- **[Multer](https://www.npmjs.com/package/multer)** — обробка multipart/form-data для завантаження зображень.

- **[Cloudinary](https://cloudinary.com/)** — хмарне сховище для обкладинок історій.

- **[Celebrate / Joi](https://www.npmjs.com/package/celebrate)** — валідація вхідних даних (body, params, query).

### 📝 Логування та Помилки

- **[Pino & pino-pretty](https://www.npmjs.com/package/pino-pretty)** — високопродуктивне логування запитів у зручному форматі.

- **[http-errors](https://www.npmjs.com/package/http-errors)** — стандартизована обробка HTTP помилок.

---

## 📂 Детальна структура проєкту

```text
pryrodni-mandry-back/
├── src/
│   ├── constants/          # Глобальні константи та регулярні вирази
│   ├── controllers/        # Логіка обробки запитів (auth, stories, etc.)
│   ├── db/                 # Ініціалізація підключення до MongoDB
│   ├── middleware/         # Authenticate, errorHandler, multer, logger
│   ├── models/             # Mongoose схеми (User, Story, Category, Session)
│   ├── routes/             # Опис ендпоінтів API
│   ├── services/           # Бізнес-логіка та пряма взаємодія з БД
│   ├── utils/              # Допоміжні функції (Cloudinary helper)
│   ├── validations/        # Схеми валідації Celebrate/Joi
│   └── server.js           # Точка входу, налаштування middleware та маршрутів
│
├── .env                    # Змінні оточення
├── .env.example            # Шаблон для змінних оточення
├── .editorconfig           # Стандарти форматування в IDE
├── .prettierrc             # Конфігурація Prettier
├── eslint.config.js        # Правила лінтера
├── package.json            # Скрипти та залежності
└── README.md               # Документація бекенду
```

---

## 🛠 Командний Workflow

### 1. Архітектура

Ми дотримуємося чіткого розподілу обов'язків:

- **Routes:** Тільки визначають шлях та підключають валідацію/auth.

- **Controllers:** Отримують `req`, викликають потрібний сервіс та повертають `res`.

- **Services:** Містять всю бізнес-логіку та запити до БД.

### 2.Робота з гілками та комітами

Використовуємо стандарт Conventional Commits:

- Використовуємо стандарт **Conventional Commits**:
  - `feat: ...` — нова функціональність.
  - `fix: ...` — виправлення помилки.
  - `docs: ...` — зміни в документації.
  - `refactor: ...` — зміни коду, які не виправляють помилку і не додають фічу
    (покращення структури).
  - `style: ... —` правки, що не впливають на логіку (відступи, форматування,
    лапки — те, що робить Prettier).
  - `perf: ... —` зміни для покращення продуктивності (наприклад, оптимізація
    рендеру списку товарів).
  - `test: ... —` додавання нових тестів або виправлення існуючих (Jest/E2E).
  - `build: ... —` зміни, що впливають на систему збірки або зовнішні залежності
    (пакети в package.json, конфіг Next.js).
  - `ci: ... —` зміни в налаштуваннях CI/CD (GitHub Actions, скрипти
    автоматизації).
  - `chore: ... —` iнші дрібні зміни, які не стосуються коду чи тестів
    (наприклад, оновлення .gitignore).

---

## ✅ Чек-лист перед Pull Request:

- [ ] **Conventional Commits**: Назва PR та комітів відповідає стандарту.
- [ ] **Форматування**: Виконано команду `npm run format`.
- [ ] **Чистота консолі**: Видалені всі `console.log`, `debugger` та
      закоментовані шматки коду.
- [ ] **Відсутність помилок**: Команда `npm run lint` проходить без
      попереджень та помилок.
- [ ] **Environment Variables**: Якщо додано нові змінні оточення, вони
      задокументовані в `.env.example`.

---

## 🚀 Як почати роботу

### 1. Підготовка

```Bash

# Клонування репозиторію

git clone https://github.com/OksanaVakuliak/pryrodni-mandry-back.git

# Встановлення залежностей

npm install
```

### 2. Змінні оточення

Створіть файл .env та заповніть наступні дані:

```text
# Server
PORT=4000

# MongoDB connection string
# Example: mongodb+srv://user:pass@cluster0.mongodb.net/dbname
MONGO_URL=

# JWT secret for signing tokens
JWT_SECRET=

# Frontend domain used in reset password link (include protocol)
# Example: http://localhost:3000
FRONTEND_DOMAIN=

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Запуск

```Bash
# Режим розробки (з nodemon)
npm run dev

# Продакшн запуск
npm run start
```

---

## 🛠 Додаткові команди для розробки

| Команда                | Що робить                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`          | Запускає сервер у режимі розробки за допомогою nodemon (автоперезапуск при змінах). |
| `npm run start`        | Запускає сервер у звичайному режимі (використовується для продакшну).               |
| `npm run format`       | Автоматично виправляє відступи та стиль коду (Prettier) у всіх файлах .js.          |
| `npm run check-format` | Перевіряє, чи відповідає код правилам форматування (без внесення змін).             |
| `npm run lint`         | Запускає перевірку коду лінтером ESLint на наявність помилок.                       |
| `npm run lint:fix`     | Автоматично виправляє прості зауваження лінтера.                                    |
