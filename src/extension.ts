import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Интерфейс для настроек
interface Settings {
	extensions: { [key: string]: boolean };
	ignorePatterns: string[];
	ignoreFiles: string[];
	ignoreExtensions: string[];
}

// Глобальные переменные
let settings: Settings;
let outputChannel: vscode.OutputChannel;

// Активация плагина
export function activate(context: vscode.ExtensionContext) {
	outputChannel = vscode.window.createOutputChannel('Copy Project to TXT');
	outputChannel.appendLine('Плагин Copy Project to TXT активирован');

	// Регистрация команды сканирования
	let scanCommand = vscode.commands.registerCommand('copy-project-to-txt.scanWorkspace', async () => {
		await scanWorkspace();
	});

	// Регистрация команды открытия настроек
	let openSettingsCommand = vscode.commands.registerCommand('copy-project-to-txt.openSettings', async () => {
		await openSettings();
	});

	context.subscriptions.push(scanCommand, openSettingsCommand);
}

// Команда открытия настроек
async function openSettings() {
	try {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('Не открыта рабочая область (workspace)');
			return;
		}

		const settingsPath = path.join(workspaceFolder.uri.fsPath, 'settings.json');

		// Если файла нет - создаем
		if (!fs.existsSync(settingsPath)) {
			const defaultSettings = getDefaultSettings();
			fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
			vscode.window.showInformationMessage('Создан файл настроек settings.json');
		}

		// Открываем файл настроек
		const doc = await vscode.workspace.openTextDocument(settingsPath);
		await vscode.window.showTextDocument(doc);

		outputChannel.appendLine('Открыт файл настроек');

	} catch (error) {
		outputChannel.appendLine(`Ошибка при открытии настроек: ${error}`);
		vscode.window.showErrorMessage(`Ошибка: ${error}`);
	}
}

// Основная функция сканирования
async function scanWorkspace() {
	try {
		// Загружаем настройки
		if (!await loadSettings()) {
			vscode.window.showErrorMessage('Не удалось загрузить настройки плагина');
			return;
		}

		// Проверяем наличие рабочей области
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('Не открыта рабочая область (workspace)');
			return;
		}

		const rootPath = workspaceFolder.uri.fsPath;
		outputChannel.appendLine(`Начинаем сканирование: ${rootPath}`);

		// Собираем все файлы
		const files: string[] = [];
		await collectFiles(rootPath, files);

		outputChannel.appendLine(`Найдено файлов: ${files.length}`);

		// Формируем содержимое отчета
		let content = generateReportHeader(rootPath);

		for (const file of files) {
			const relativePath = path.relative(rootPath, file);
			content += generateFileContent(file, relativePath);
		}

		// Сохраняем результат
		const resultPath = path.join(rootPath, 'project_export.txt');
		fs.writeFileSync(resultPath, content, 'utf-8');

		outputChannel.appendLine(`Результат сохранен: ${resultPath}`);

		// Показываем уведомление
		const openFile = await vscode.window.showInformationMessage(
			`Сканирование завершено! Найдено файлов: ${files.length}`,
			'Открыть результат',
			'Открыть настройки'
		);

		if (openFile === 'Открыть результат') {
			const doc = await vscode.workspace.openTextDocument(resultPath);
			await vscode.window.showTextDocument(doc);
		} else if (openFile === 'Открыть настройки') {
			await openSettings();
		}

	} catch (error) {
		outputChannel.appendLine(`Ошибка: ${error}`);
		vscode.window.showErrorMessage(`Ошибка при сканировании: ${error}`);
	}
}

// Загрузка настроек из settings.json
async function loadSettings(): Promise<boolean> {
	try {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			return false;
		}

		const settingsPath = path.join(workspaceFolder.uri.fsPath, 'settings.json');

		// Проверяем существование файла настроек
		if (!fs.existsSync(settingsPath)) {
			// Создаем файл настроек по умолчанию
			const defaultSettings = getDefaultSettings();
			fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
			vscode.window.showInformationMessage('Создан файл настроек settings.json. Отредактируйте его при необходимости.');
		}

		// Загружаем настройки
		const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
		settings = JSON.parse(settingsContent);

		outputChannel.appendLine('Настройки загружены');
		return true;

	} catch (error) {
		outputChannel.appendLine(`Ошибка загрузки настроек: ${error}`);
		return false;
	}
}

// Настройки по умолчанию
function getDefaultSettings(): Settings {
	return {
		extensions: {
			".txt": true, ".js": true, ".ts": true, ".jsx": true, ".tsx": true,
			".json": true, ".css": true, ".scss": true, ".html": true, ".xml": true,
			".md": true, ".py": true, ".java": true, ".cpp": true, ".h": true,
			".c": true, ".cs": true, ".php": true, ".rb": true, ".go": true,
			".rs": true, ".sql": true, ".yaml": true, ".yml": true, ".sh": true,
			".bat": true, ".ps1": true, ".gradle": true, ".properties": true,
			".ini": true, ".cfg": true, ".conf": true, ".vue": true, ".svelte": true
		},
		ignorePatterns: [
			"node_modules", "build", "dist", "out", "bin", ".git", ".vscode",
			".idea", ".gradle", "gradle", "generated", "logs", "crash-reports",
			".metadata", ".settings", "eclipse"
		],
		ignoreFiles: [
			"package-lock.json", "gradlew", "gradlew.bat", "gradle-wrapper.jar",
			"gradle-wrapper.properties", ".DS_Store", "Thumbs.db", ".project",
			".classpath", ".factorypath", "CREDITS.txt", "LICENSE.txt",
			"README.txt", "changelog.txt"
		],
		ignoreExtensions: [
			".iml", ".ipr", ".iws", ".class", ".jar", ".log", ".bak", ".svg",
			".png", ".jpg", ".jpeg", ".gif", ".ico", ".mp3", ".wav", ".ogg",
			".mp4", ".avi", ".mov", ".exe", ".dll", ".so", ".dylib", ".zip",
			".rar", ".7z", ".tar", ".gz"
		]
	};
}

// Рекурсивный сбор файлов
async function collectFiles(dir: string, files: string[]) {
	try {
		const entries = fs.readdirSync(dir);

		for (const entry of entries) {
			const fullPath = path.join(dir, entry);
			const relativePath = path.relative(vscode.workspace.workspaceFolders![0].uri.fsPath, fullPath);

			// Проверяем нужно ли игнорировать
			if (shouldIgnore(entry, relativePath)) {
				continue;
			}

			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				await collectFiles(fullPath, files);
			} else {
				// Проверяем расширение файла
				const ext = path.extname(entry).toLowerCase();
				if (settings.extensions[ext] === true) {
					files.push(fullPath);
				} else {
					outputChannel.appendLine(`Игнорируем файл (расширение не в списке): ${relativePath}`);
				}
			}
		}
	} catch (error) {
		outputChannel.appendLine(`Ошибка при чтении папки ${dir}: ${error}`);
	}
}

// Проверка нужно ли игнорировать файл/папку
function shouldIgnore(name: string, relativePath: string): boolean {
	// Игнорируем системные папки
	if (name === '.' || name === '..') {
		return true;
	}

	// Проверяем по паттернам папок
	for (const pattern of settings.ignorePatterns) {
		if (relativePath.split(path.sep).includes(pattern)) {
			return true;
		}
	}

	// Проверяем по именам файлов
	for (const ignoreFile of settings.ignoreFiles) {
		if (name === ignoreFile) {
			return true;
		}
	}

	// Проверяем по расширениям
	const ext = path.extname(name).toLowerCase();
	for (const ignoreExt of settings.ignoreExtensions) {
		if (ext === ignoreExt) {
			return true;
		}
	}

	return false;
}

// Генерация заголовка отчета
function generateReportHeader(rootPath: string): string {
	const now = new Date();
	return `PROJECT EXPORT REPORT
===========================================
Path: ${rootPath}
Date: ${now.toLocaleString()}
===========================================

`;
}

// Генерация содержимого файла
function generateFileContent(filePath: string, relativePath: string): string {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		const separator = `######### File: ${relativePath} #########`;

		// Формируем блок файла без лишних отступов
		return `${separator}\n${content}\n\n`;

	} catch (error) {
		outputChannel.appendLine(`Ошибка чтения файла ${filePath}: ${error}`);
		return `######### File: ${relativePath} #########\n[ERROR: Cannot read file]\n\n`;
	}
}

// Деактивация плагина
export function deactivate() {
	if (outputChannel) {
		outputChannel.dispose();
	}
}