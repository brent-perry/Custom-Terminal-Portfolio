const input = document.querySelector(".terminal input")
const output = document.querySelector(".terminal output")
const intro = "Hello! I'm Your Name Here. \nType 'help' for commands \n"
const files = {
    "about.txt": [`Here's a little about myself
    - Full Stack Developer
    - Game Developer
    - Unity`],
    "contact.txt": [`Here's how to reach me
    - Email: fakeemail @gmail.com
    - Phone: 555-555-5555
    - `, createLink("https://example.com/", "Linkedin", "_blank")],
    "languages.txt": [`Here are some languages I prefer to use
    - HTML
    - CSS
    - NODE.JS
    - JS
    - C#
    - JAVA`],
    "experience.txt": [`Here is my work experience
    - I have experience in stuff`],
    "projects.txt": [`Here are some projects I've done
    - `, createLink("https://example.com/", "Github", "_blank")],
    "games.txt": [`Here are some games I have made 
    - `, createLink("https://example.com/", "Minigame", "_blank"),
    `
    - `, createLink("https://example.com/", "Big game", "_blank")]
}

const help =
    `Type one of the commands listed
Shortcut use the numbers (1-4)
1. ls - Shows what files you can view
2. clear - Clears the terminal completely
3. cat - View the desired file \n type 'cat (file_name).txt'
4. whoami - Shows important links`
let terminalHistory = [intro]
function parseCat(command) {
    const [cat, ...filenames] = command.split(" ").filter(part => part !== "")
    return filenames
}

function createLink(url, text, target) {
    const a = document.createElement("a")
    a.href = url
    a.textContent = text
    a.target = target
    return a
}

function render() {
    output.textContent = ""
    for (const item of terminalHistory) {
        if (typeof item === "string") {
            const node = document.createTextNode(item)
            output.appendChild(node)
        }
        else if (item instanceof HTMLElement) {
            output.appendChild(item)
        }
        else {
            console.log(item)
            throw new Error("Unknown type")
        }
    }
}

function addToHistory(...content) {
    for (const item of content) {
        terminalHistory.push(item)
    }
}

function extensionCorrector(filenames) {//ternary operator
    return filenames.map(filename => filename.endsWith(".txt")//condition
        ? filename //if
        : filename + ".txt")//else 
}

function updateScroll() {
    output.scrollTop = output.scrollHeight
}

render()
function interpretCommand(command) {
    addToHistory("\nyourname@desktop:dev/porfolio$ " + command + "\n")
    command = command.trim().toLowerCase()
    if (command === "ls" || command === "1") {
        addToHistory(Object.keys(files).join("\n"))
    }
    else if (command === "clear" || command === "2") {
        terminalHistory = [intro]
    }
    else if (command.startsWith("cat") || command.startsWith("3")) {
        const filenames = extensionCorrector(parseCat(command))
        if (filenames.length === 0) {
            addToHistory("Cat requires at least one file name")
        }
        let numberOfFailures = 0
        for (const filename of filenames) {
            const exists = files[filename]
            if (!exists) {
                addToHistory("File does not exist \nType 'ls' for existing files")
                numberOfFailures += 1
            }
        }
        if (numberOfFailures == 0) {
            const contents = filenames.flatMap(filename => files[filename])
            addToHistory(...contents)
        }
    }
    else if (command === "help") {
        addToHistory(help)
    }
    else if (command === "whoami" || command === "4") {
        addToHistory("    - Person \n    - Human\n    - Full Stack Developer\n    - Game Developer")
    }
    else {
        addToHistory("Oops that command doesn't work \nType 'help' for instructions")
    }
    render()
    updateScroll()
}

input.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        interpretCommand(input.value)
        input.value = ""
    }
})