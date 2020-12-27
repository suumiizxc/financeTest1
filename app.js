var uiController = (function(){
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: '.add__btn'

    }
    
    return {
        getInput : function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value

            }
        },

        getDOMstrings : function(){
            return DOMstrings;
            
        }
    }

})();

var financeController = function(){
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expenses = function(id, description, value){
        this.id = id; 
        this.description = description;
        this.value = value;
    }

    data = {
        items : {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }

    return {
        addItem: function(type, desc, val){
            console.log('Item added');
            var item,id; 

            if(data.items[type].length === 0){
                id = 1;
            } else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }

            if(type === 'inc'){
                item = new Income(id, desc, val);

            } else {
                item = new Expenses(id, desc, val);
            }

            data.items[type].push(item);
        },
        seeData: function(){
            return data;
        }
    }

}();


var appController = (function(uiController, financeController){
    // 1. Оруулах өгөгдлөө дэлгэцнээс олж авах
    // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална. 
    // 3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана.  
    // 4. Төсвийг тооцоолно.
    // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана. 

    
    var coreItemCollect = function(){
        var input = uiController.getInput();

        financeController.addItem(input.type,input.description, input.value);
    }
    
    var setupEventListener = function(){
        var DOMstrings = uiController.getDOMstrings();

        document.querySelector(DOMstrings.inputBtn).addEventListener("click", (function(){
            coreItemCollect();
        }))
    
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13){
                coreItemCollect();
            }
        })
    }

    return {
        init: function(){
            console.log('Application starting....');
            setupEventListener();
        }
    }
   
})(uiController, financeController);

appController.init();