const fileSystem = {
    'darios': {
        type: 'directory',
        content: {
            'secretos': {
                type: 'directory',
                content: {
                    'archivo_secreto.txt': { type: 'file', content: '01001100 01101111 01110011 00100000 01110011 01100101 01100011 01110010 01100101 01110100 01101111 01110011 00100000 01100100 01100101 00100000 01101100 01100001 00100000 01101111 01110011 01100011 01110101 01110010 01101001 01100100 01100001 01100100' },
                }
            },
            'rituales': {
                type: 'directory',
                content: {
                    'ritual_oscuro.txt': { type: 'file', content: 'Invocación de las sombras ancestrales...' },
                }
            },
            'maldiciones': {
                type: 'directory',
                content: {
                    'maldicion_eterna.txt': { type: 'file', content: 'La maldición de los códigos perdidos...' },
                }
            },
            'conjuros': {
                type: 'directory',
                content: {
                    'conjuro_binario.txt': { type: 'file', content: '666 ERROR 666 SYSTEM FAILURE 666' },
                }
            }
        }
    }
};

let currentPath = [];
const terminal = document.getElementById('terminal-input');
const output = document.getElementById('terminal-output');

function updatePrompt() {
    const path = currentPath.length ? '/' + currentPath.join('/') : '';
    document.querySelector('.prompt').textContent = `root@esquelesuad:${path}$`;
}

function addToTerminal(text, className = '') {
    const p = document.createElement('p');
    p.textContent = text;
    if (className) p.className = className;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}

function getCurrentDirectory() {
    let current = fileSystem;
    for (const dir of currentPath) {
        current = current[dir].content;
    }
    return current;
}

function listDirectory() {
    const current = getCurrentDirectory();
    addToTerminal(`Contenido de /${currentPath.join('/')}:`, 'directory');
    for (const [name, item] of Object.entries(current)) {
        const icon = item.type === 'directory' ? '📁' : '📄';
        addToTerminal(`└── ${icon} ${name}`, 'file');
    }
}

function handleCommand(command) {
    const [cmd, ...args] = command.trim().split(' ');
    
    addToTerminal(`root@esquelesuad:~$ ${command}`, 'command-history');

    switch (cmd.toLowerCase()) {
        case 'cd':
            if (!args[0] || args[0] === '..') {
                if (currentPath.length > 0) {
                    currentPath.pop();
                    addToTerminal(`Regresando a /${currentPath.join('/')}`, 'success-message');
                } else {
                    addToTerminal('Ya estás en el directorio raíz', 'error-message');
                }
            } else {
                let current = getCurrentDirectory();
                if (current[args[0]] && current[args[0]].type === 'directory') {
                    currentPath.push(args[0]);
                    addToTerminal(`Accediendo a ${args[0]}...`, 'success-message');
                } else {
                    addToTerminal(`Error: ${args[0]} no es un directorio válido`, 'error-message');
                }
            }
            break;

        case 'ls':
            listDirectory();
            break;

        case 'cat':
            if (!args[0]) {
                addToTerminal('Error: Debes especificar un archivo', 'error-message');
                break;
            }
            const current = getCurrentDirectory();
            if (current[args[0]] && current[args[0]].type === 'file') {
                addToTerminal(current[args[0]].content, 'success-message');
            } else {
                addToTerminal(`Error: ${args[0]} no es un archivo válido`, 'error-message');
            }
            break;

        case 'help':
            addToTerminal('Comandos disponibles:', 'success-message');
            addToTerminal('cd <directorio> - Cambiar de directorio', 'success-message');
            addToTerminal('cd .. - Regresar al directorio anterior', 'success-message');
            addToTerminal('ls - Listar contenido del directorio', 'success-message');
            addToTerminal('cat <archivo> - Ver contenido de un archivo', 'success-message');
            addToTerminal('clear - Limpiar la terminal', 'success-message');
            break;

        case 'clear':
            output.innerHTML = '';
            break;

        default:
            addToTerminal(`Comando no reconocido: ${cmd}. Escribe 'help' para ver los comandos disponibles.`, 'error-message');
    }

    updatePrompt();
}

terminal.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = terminal.value;
        if (command.trim()) {
            handleCommand(command);
        }
        terminal.value = '';
    }
});

// Mantener el foco en el input
terminal.addEventListener('blur', () => {
    setTimeout(() => terminal.focus(), 10);
}); 
