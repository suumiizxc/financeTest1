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
        titleLabel : ".budget__title",
        containerDiv : ".container",
        expensePercentageLabel : ".item__percentage"

        
    }
    

    // var nodeListForEach = function(list, callBack){
    //     for(var i = 0; i < list.length; i++){
    //         callBack(list[i], i);
    //     }
    // };

    return {

        displayPercentages : function(allPercentages){
            var elements = document.querySelector(DOMstrings.expensePercentageLabel);
            console.log(elements.length);
            // nodeListForEach(elements, function(el, index){
            //     console.log(el);
            //     el.textContent = allPercentages[index];
            // });




        },

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

        deleteListItem : function(id){
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        addListItem : function(item, type){
            var html,list, html1, date;

            date = new Date();

            html1 = 'This month is <span class="budget__title--month">%Month%</span>';

            html1 = html1.replace("%Month%", (date.getMonth() + 1));
            
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
        this.percentage = -1;
    }

    Expenses.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = 0;
        }

    }

    Expenses.prototype.getPercentage = function(){
        return this.percentage;
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.items[type].forEach(function(el){
            sum = sum + el.value;
        })

        data.totals[type] = sum;

        data.balance = data.totals['inc'] - data.totals['exp'];

        if(data.totals.inc > 0){
            data.balancePercent = (data.totals['exp'] / data.totals['inc']) * 100;
        } else {
            data.balancePercent = 0;
        }

        

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

        calculatePercentage: function(){
            data.items.exp.forEach(function(element){
                element.calcPercentage(data.totals.inc);
            })
        },
        getPercentages: function(){
            var allPercentages = data.items.exp.map(function(element){
                return element.getPercentage();
            })

            return allPercentages;
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

            updateBalance();
        }

    }
    
    var updateBalance = function(){
        financeController.calculateBalance();

            var balanceFetch = financeController.fetchBalance();

            uiController.seeBalance(balanceFetch);

            financeController.calculatePercentage();

            var allPercentages = financeController.getPercentages();


            if(allPercentages.length !== 0){
                console.log('RUn if');
                uiController.displayPercentages(allPercentages);
            }
            
}

    var setupEventListener = function(){
        var DOMstrings = uiController.getDOMstrings();

        document.querySelector(DOMstrings.inputBtn).addEventListener("click", (function(){
            coreItemCollect();
        }));
    
        document.addEventListener("keypress", function(event){
            if(event.keyCode === 13){
                coreItemCollect();
            }
        });

        document.querySelector(DOMstrings.containerDiv).addEventListener("click", function(event){
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(id){
                var arr = id.split("-");
                var type, itemId;
                
                if(arr[0] === "income"){
                    type = "inc";
                } else {
                    type = "exp";
                }
                itemId = parseInt(arr[1]);
                financeController.deleteItem(type, itemId);

                uiController.deleteListItem(id);
                
                updateBalance();

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