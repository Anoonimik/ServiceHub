# Инструкция по загрузке на GitHub

## Шаг 1: Добавьте файлы в git

```bash
git add .
```

## Шаг 2: Сделайте первый коммит

```bash
git commit -m "Initial commit: ServiceHub - Universal Service Booking Platform"
```

## Шаг 3: Создайте репозиторий на GitHub

1. Перейдите на https://github.com/new
2. Название репозитория: **ServiceHub**
3. Описание: "Universal Service Booking Platform"
4. Выберите Public или Private
5. НЕ добавляйте README, .gitignore или лицензию (они уже есть)
6. Нажмите "Create repository"

## Шаг 4: Подключите локальный репозиторий к GitHub

После создания репозитория GitHub покажет инструкции. Выполните:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ServiceHub.git
git branch -M main
git push -u origin main
```

Замените `YOUR_USERNAME` на ваш GitHub username.

## Альтернативный способ (если используете SSH):

```bash
git remote add origin git@github.com:YOUR_USERNAME/ServiceHub.git
git branch -M main
git push -u origin main
```

## Готово! 🎉

Ваш репозиторий теперь на GitHub по адресу:
https://github.com/YOUR_USERNAME/ServiceHub

