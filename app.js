var uiController = (function(){

})();

var financeController = (function(){});

var appController = (function(uiController, financeController){
    // 1. Оруулах өгөгдлөө дэлгэцнээс олж авах
    // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална. 
    // 3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана.  
    // 4. Төсвийг тооцоолно.
    // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана. 

    var coreItemCollect = function(){
        console.log("Information collected..");
    }

    document.querySelector(".add__btn").addEventListener("click", (function(){
        coreItemCollect();
    }))

    document.addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            coreItemCollect();
        }
    })
})(uiController, financeController);