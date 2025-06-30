import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Список игнорируемых файлов и папок (регулярные выражения)
const IGNORE_PATTERNS = [
    /^\.(env|git|vscode|idea|gradle)$/i,  // Скрытые папки и файлы
    /^(build|out|bin|dist|generated|eclipse|run)$/i, // Папки сборки и IDE
    /^(gradlew|gradlew\.bat|gradle\.properties)$/i,  // Gradle-файлы
    /^(.*\.(iml|ipr|iws|class|jar|log|bak)|gradle\.wrapper)/i, // Временные файлы
    /^(settings\.gradle|gradle\.properties)$/, // Настройки Gradle
    /^node_modules$/,           // Папка node_modules (если используется)
    /^package(-lock)?\.json$/,  // Файлы npm (если есть)
    /^.*\.(svg|png|jpg|jpeg|mp3|wav|ogg)$/i, // Медиа-файлы
    /^logs$/,                   // Логи игры
    /^crash-reports$/,          // Отчёты о крашах
    /^\.project$/,              // Файлы Eclipse
    /^\.settings$/,             // Настройки Eclipse
    /^\.classpath$/,
    /^\.factorypath$/,
    /^\.DS_Store$/,             // MacOS системные файлы
    /^Thumbs\.db$/i,            // Windows системные файлы
    /^\.metadata$/,             // Методанные IDE
    /^(CREDITS|LICENSE|README|changelog)\.txt$/i  // Добавленные файлы для игнорирования
];

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.copyProjectToTxt', async () => {
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage('Откройте папку проекта в VS Code!');
			return;
		}

		const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		const outputFile = path.join(workspacePath, 'project_content.txt');

		try {
			await processDirectory(workspacePath, outputFile);
			vscode.window.showInformationMessage(`Проект скопирован в ${outputFile}`);
		} catch (error) {
			vscode.window.showErrorMessage(`Ошибка: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

async function processDirectory(dirPath: string, outputFile: string): Promise<string> {
	const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
	let outputContent = '';

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);

		// Проверка на игнорируемые файлы/папки
		if (IGNORE_PATTERNS.some(pattern => pattern.test(entry.name))) {
			continue;
		}

		if (entry.isDirectory()) {
			outputContent += `\n\n=== Директория: ${entry.name} ===\n\n`;
			const subDirContent = await processDirectory(fullPath, outputFile);
			outputContent += subDirContent;
		} else {
			outputContent += `\n--- Файл: ${entry.name} ---\n\n`;
			try {
				const fileContent = await fs.promises.readFile(fullPath, 'utf-8');
				outputContent += fileContent;
			} catch {
				outputContent += '[Бинарный файл или недоступен для чтения]';
			}
		}
	}

	// Запись только в корневой директории
	if (dirPath === path.dirname(outputFile)) {
		await fs.promises.writeFile(outputFile, outputContent);
	}

	return outputContent;
}

export function deactivate() { }