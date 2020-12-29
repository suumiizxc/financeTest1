var uiController = (function(){
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: '.add__btn',
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        balanceLabel: ".budget__value",
        totalIncomeLabel : ".budget__income--value",
        totalExpenseLabel : ".budget__expenses--value",
        totalExpensePercentageLabel :".budget__expenses--percentage",
        titleLabel : ".budget__title"

        
    }
    
    return {
        getInput : function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)

            }
        },

        getDOMstrings : function(){
            return DOMstrings;
            
        },
        seeBalance :function(balance){
            document.querySelector(DOMstrings.balanceLabel).textContent = balance.balance;
            document.querySelector(DOMstrings.totalIncomeLabel).textContent = balance.totalInc;
            document.querySelector(DOMstrings.totalExpenseLabel).textContent = balance.totalExp;
            document.querySelector(DOMstrings.totalExpensePercentageLabel).textContent = balance.balancePercent + "%";
        },
        addListItem : function(item, type){
            var html,list, html1, date;

            date = new Date();

            html1 = 'This month is <span class="budget__title--month">%Month%</span>';

            html1 = html1.replace("%Month%", (date.getMonth() + 1));
            console.log(html1);
            document.querySelector(DOMstrings.titleLabel).insertAdjacentHTML('beforeend', html1);

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

    var calculateTotal = function(type){
        var sum = 0;
        data.items[type].forEach(function(el){
            sum = sum + el.value;
        })

        data.totals[type] = sum;

        data.balance = data.totals['inc'] - data.totals['exp'];

        data.balancePercent = (data.totals['exp'] / data.totals['inc']) * 100;

    }

    data = {
        items : {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0
        },

        balance : 0,
        balancePercent: 0
    }

    return {
        calculateBalance: function(){
            calculateTotal('inc');
            calculateTotal('exp');

        },

        fetchBalance: function(){
            return {
                balance : data.balance,
                balancePercent : data.balancePercent,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp
            }
        },
        deleteItem : function(type, id){
            var ids = data.items[type].map(function(element){
                return element.id;
            });

            var index = ids.indexOf(id);

            if(index !== -1){
                data.items[type].splice(index,1);
            }
        },

        
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
        
        if(input.description !== "" && input.value !== ""){
            var item = financeController.addItem(input.type,input.description, input.value);

            uiController.addListItem(item, input.type);
            uiController.clearFields();

            financeController.calculateBalance();

            var balanceFetch = financeController.fetchBalance();
            console.log(balanceFetch);

            uiController.seeBalance(balanceFetch);
        }


        
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

            uiController.seeBalance({
                balance : 0,
                balancePercent : 0,
                totalInc : 0,
                totalExp : 0
            })
        }
    }
   
})(uiController, financeController);

appController.init();