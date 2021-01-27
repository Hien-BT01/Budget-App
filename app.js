let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";
$(document).ready(function () {
    ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
    updateValue(); 
    $(".tab-1").click(function (e) { 
        $("#expense").removeClass("hide").siblings("#income,#all").addClass("hide");
        $([$("#income"),$("#all")]).addClass("hide");
        $(this).addClass("active").siblings().removeClass("active");
        $([$("#tab-2"),$("#tab-3")]).removeClass("active");
    });
    
    $(".tab-2").click(function (e) { 
        $("#income").removeClass("hide").siblings("#expense,#all").addClass("hide");
        $([$("#expense"),$("#all")]).addClass("hide");
        $(this).addClass("active").siblings().removeClass("active");
        $([$("#tab-1"),$("#tab-3")]).removeClass("active");
    });
    
    $(".tab-3").click(function (e) { 
        $("#all").removeClass("hide").siblings("#income,#expense").addClass("hide");
        $([$("#expense"),$("#income")]).addClass("hide");
        $(this).addClass("active").siblings().removeClass("active");
        $([$("#tab-1"),$("#tab-2")]).removeClass("active");
    });    
    $(".add-expense").click(function (e) {
        e.stopPropagation();
        if(!$("#expense-title__input").val() || !$("#expense-amount__input").val()){
            return;
        }
        let expense = {
            type: "expense",
            title: $("#expense-title__input").val(),
            amount : parseInt($("#expense-amount__input").val())
        }
        ENTRY_LIST.push(expense);
        updateValue();
        $("#expense-title__input").val("");
        $("#expense-amount__input").val("")
    });
    $(".add-income").click(function (e) {
        e.stopPropagation();
        if(!$("#income-title__input").val() || !$("#income-amount__input").val()){
            return;
        }
        let income = {
            type: "income",
            title: $("#income-title__input").val(),
            amount : parseInt($("#income-amount__input").val())
        }
        ENTRY_LIST.push(income);
        updateValue();
        $("#income-title__input").val("")
        $("#income-amount__input").val("")
    });
    function updateValue(){
        income = caculateTotal("income",ENTRY_LIST);
        outcome = caculateTotal("expense",ENTRY_LIST);
        balance = Math.abs(caculateBalance(income,outcome));
        let sign = (income >= outcome) ? "$" : "-$";
        clearElement([$("#expense .list"),$("#income .list"),$("#all .list")]);
        $(".balance__value").html(`<small>${sign}</small>${balance}`)
        $(".income__total").html(`<small>$</small>${income}`)
        $(".outcome__total").html(`<small>$</small>${outcome}`)
        ENTRY_LIST.forEach((entry,index) => {
            if(entry.type === "expense"){
                showEntry($("#expense .list"),entry.type,entry.title,entry.amount,index);
            }else if(entry.type === "income"){
                showEntry($("#income .list"),entry.type,entry.title,entry.amount,index);
            }
            showEntry($("#all .list"),entry.type,entry.title,entry.amount,index);
        })
        updateDraw(income,outcome,drawCircle);
        localStorage.setItem("entry_list",JSON.stringify(ENTRY_LIST));
    }
    function showEntry(list, type, title, amount, index){
        const entry = `
            <li id="${index}" class="list__item ${type}">
                <h3 class="entry">${title}: $${amount}</h3>
                <div class="edit"><i class="far fa-edit"></i></div>
                <div class="delete"><i class="fas fa-trash"></i></div>
            </li>
        `
        list.append(entry);
    }
    function clearElement(elements){
        elements.forEach(element => {
            element.html("");

        })
    }
    function caculateTotal(type,list){
        let sum = 0;
        list.forEach(item => {
            if(item.type == type){
                sum += item.amount;
            }
        })
        return sum;
    }
    function caculateBalance(income,outcome){
        return income - outcome;
    }
    $("#expense .list").click(deleteOrEdit)
    $("#income .list").click(deleteOrEdit)
    $("#all .list").click(deleteOrEdit)
    function deleteOrEdit(e){
        const targetBtn = e.target.parentNode;
        const entry = targetBtn.parentNode;
        if(targetBtn.className === DELETE){
            deleteEntry(entry);
        }else if(targetBtn.className === EDIT){
            editEntry(entry);
        }
    }
    function deleteEntry(entry){
        ENTRY_LIST.splice(entry.id,1);
        updateValue();  
    }
    function editEntry(entry){
        let ENTRY = ENTRY_LIST[entry.id] 
        if(ENTRY.type === "income"){
            $("#income-title__input").val(ENTRY.title);
            $("#income-amount__input").val(ENTRY.amount);
        }else if(ENTRY.type === "expense"){
            $("#expense-title__input").val(ENTRY.title);
            $("#expense-amount__input").val(ENTRY.amount);
        }
        deleteEntry(entry);
    }
});
