var uiController = (function(){
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: '.add__btn',
        incomeList: ".income__list",
        expenseList: ".expenses__list"

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
            
        },

        addListItem : function(item, type){
            var html,list;
            if(type === "inc"){
                list = DOMstrings.incomeList;
                var html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';  
            } else{
                list = DOMstrings.expenseList;
                var html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            html = html.replace("%id%", item.id);
            html = html.replace("%DESCRIPTION%", item.description);
            html = html.replace("%VALUE%", item.value);
            
            document.querySelector(list).insertAdjacentHTML('beforeend', html);
        },
        clearFields: function(){
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", "  + DOMstrings.inputValue);

            // Convert List to Array

            var fieldsArr = Array.prototype.slice.call(fields);
            
            // clear Description and Value section
            // for(var i = 0; i < fieldsArr.length; i++){
            //     fieldsArr[i].value = "";
            // }

            fieldsArr.forEach(element => {
                element.value="";
            });

            fieldsArr[0].focus();

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

            return item;
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

        var item = financeController.addItem(input.type,input.description, input.value);

        uiController.addListItem(item, input.type);
        uiController.clearFields();
        
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