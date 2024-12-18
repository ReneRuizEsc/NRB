function getFileExtension(name){
    try {
        let ext = name.match(/\.[^.]+$/gmi);

        return ext === null ? null : ext[0];
    } catch {
        return name;
    }
}

module.exports = {
    getFileExtension
}

//This serves no purpose now; its reduntant and never used.