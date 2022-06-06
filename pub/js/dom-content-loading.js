export default new Promise(resolve => {

    document.addEventListener("DOMContentLoaded", resolve);
    if(document.readyState === "complete")
        resolve();

});
