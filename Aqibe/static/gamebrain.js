import { customer_payment, putMoney } from "./moneyontable.js";
import { nextBilling,Calculate } from "./machinebuttons.js";

document.querySelector(".billing").addEventListener("click", nextBilling);

document.querySelector(".enter").addEventListener("click", function(){
    Calculate(this,customer_payment);
});


document.querySelectorAll(".box_bottom").forEach(element => {
    element.addEventListener("click",function(event){
        putMoney(parseInt(event.target.textContent));
    });
});
