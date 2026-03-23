<table border="20" align="center">
     <tr>
        <td>
            <img src="https://github.com/somenmi/images/raw/main/Copy-Project-to-TXT/logo.png" width="120" height="120">
        </td>
        <td align="center">
            <h1><a href="https://github.com/somenmi/Copy-Project-to-TXT"><b>Copy Project to TXT</b></a></h1>
            <p><strong>Расширение для VS Code, которое собирает все файлы вашего проекта в один текстовый файл.</strong></p>
        </td>
     </tr>
</table>

<div align="center">

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code%20Marketplace-Install-pink?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=Yalkee.copy-project-to-txt)
![Version](https://img.shields.io/visual-studio-marketplace/v/Yalkee.copy-project-to-txt?color=f5bcc6)
![Installs](https://img.shields.io/visual-studio-marketplace/i/Yalkee.copy-project-to-txt?color=f5bcc6)
![License](https://img.shields.io/badge/License-MIT-pink.svg)

</div>

## Особенности
- 📋 Сбор всех файлов проекта в один текстовый файл
- ⚙️ Гибкая настройка - выбирайте какие расширения включать
- 🎯 Умное игнорирование - исключает бинарные файлы, node_modules и т.д.
- 🌍 Поддержка 30+ языков программирования
- 📁 Сохраняет структуру проекта с красивыми заголовками

## Установка

1. Откройте VS Code
2. Нажмите `Ctrl+Shift+X` для открытия расширений
3. Найдите "Copy Project to TXT"
4. Нажмите "Установить"

Или установите из командной строки:
```bash
code --install-extension Yalkee.copy-project-to-txt
```

## Использование

1. Откройте проект в VS Code
2. Нажмите `Ctrl+Shift+P` (или `Cmd+Shift+P` на Mac)
3. Введите команду `Copy Project to TXT: Сканировать проект`
4. Файл `project_export.txt` появится в корне проекта

## Настройка

После первого запуска в корне проекта создается файл `settings.json`:

    {
    "extensions": {
        ".js": true,
        ".ts": true,
        ".py": true,
        ".txt": false,
        "...": ... и т.д.
    },
    "ignorePatterns": ["node_modules", "dist", "build"],
    "ignoreFiles": ["package-lock.json", ".DS_Store"],
    "ignoreExtensions": [".png", ".jpg", ".mp3"]
    }

### Параметры настройки

- **extensions** - расширения файлов: `true` = включать, `false` = исключать
- **ignorePatterns** - папки для игнорирования
- **ignoreFiles** - конкретные файлы для игнорирования
- **ignoreExtensions** - расширения для игнорирования

## Команды

- `Copy Project to TXT: Сканировать проект` - запускает сбор всех файлов
- `Copy Project to TXT: Открыть настройки` - открывает файл настроек

## Поддерживаемые расширения

JavaScript (.js, .jsx), TypeScript (.ts, .tsx), Python (.py), Java (.java), C++ (.cpp, .h), C# (.cs), PHP (.php), Ruby (.rb), Go (.go), Rust (.rs), HTML (.html), CSS (.css, .scss), JSON (.json), XML (.xml), Markdown (.md), SQL (.sql), YAML (.yml, .yaml), Shell (.sh, .bash), Batch (.bat, .cmd), Gradle (.gradle), Vue (.vue), Svelte (.svelte) и другие.

# Версии

### v0.1.0 : Оригинальная версия
    × Базовый функционал сканирования проекта
    × Сбор файлов в один текстовый файл
    × Формат заголовков "--- Файл: [название] ---"
    × Простая система игнорирования через регулярные выражения

### v1.0.0 : Глобальное обновление
    × Полностью переработанная система настроек (settings.json с булевыми значениями)
    × Новый формат заголовков "######### File: [название] #########"
    × Исправлены лишние отступы и переносы строк
    × Добавлена команда "Открыть настройки" для быстрого доступа
    × Упрощенная система игнорирования (папки, файлы, расширения)
    × Поддержка 30+ популярных расширений
    × Автоматическое создание файла настроек при первом запуске
    × Улучшенная производительность и оптимизация кода
    × Обновлен интерфейс команд

    × v1.0.1 : light minor
        ↪︎ доработка README.md