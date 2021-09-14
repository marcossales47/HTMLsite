let cart=[];
let modalKey=0;

/* ModalQt is a variable to keep the choices of user about pizzas quantities */
let modalQt=1;

pizzaJson.map((item, index)=>{

    /*Here it will be clonated the models of each pizza for how many times have in
    pizzaJson (that is 7 times) */
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    
    /*Here is put an "Data-key" for each pizza, "data-key" is first parameter, "index" is
    the second and refer to each item inside pizzaJson */
    pizzaItem.setAttribute('data-key', index);
           
    pizzaItem.querySelector('.pizza-item--img img').src=item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML='R$ ' + item.price.toFixed(2);
    pizzaItem.querySelector('.pizza-item--name').innerHTML=item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description;

    document.querySelector('.pizza-area').append(pizzaItem);

    /*Here we block the 'a' link and, instead, put the activity to open 
    the WindowBodyPizza */
        pizzaItem.querySelector('.pizza-item a').addEventListener('click', (element)=>{
        element.preventDefault();

        //Recover the "data-key" for the beggining of this code
        let key=element.target.closest('.pizza-item').getAttribute('data-key');

        /*Is needed to put de modalQt here to everytime that user open an pizza
        the quantitie return to 1*/
        modalQt=1;

        modalKey=key;

        /*Here we put correct information on WindowsPizzaBody*/

        document.querySelector('.pizzaInfo h1').innerHTML=pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML=pizzaJson[key].description;
        document.querySelector('.pizzaBig img').src=pizzaJson[key].img;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML='R$ '+ pizzaJson[key].price.toFixed(2);
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');

        /*Here is configuring the selection of sizes and the mark*/
        document.querySelectorAll('.pizzaInfo--size').forEach((size, Sizeindex)=>{

                /*This "if" is for size 'Big'(2) be the default*/
                if(Sizeindex == 2){
                    size.classList.add('selected');
                }

                size.querySelector('span').innerHTML=pizzaJson[key].sizes[Sizeindex];
        });
        
        document.querySelector('.pizzaInfo--qt').innerHTML=modalQt;
                
        document.querySelector('.pizzaWindowArea').style.opacity=0;
        document.querySelector('.pizzaWindowArea').style.display='flex';

       setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.opacity=1;
       },200);
    });
        
    
});
//Here ends the Json.map to start the specific Events


function closeModal(){
    document.querySelector('.pizzaWindowArea').style.opacity=0;
    setTimeout(()=>{
        document.querySelector('.pizzaWindowArea').style.display='none';
    }, 500);
}
document.querySelectorAll('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').
forEach((item)=>{
    item.addEventListener('click', (item)=>{
        closeModal();
    })
});

//Adjusting buttons "add" and "remove" itens
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML=modalQt;

});
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=>{

    /*This "if" is for user can't reach anything less than number 1*/
    if(modalQt>1){
        modalQt--;
        document.querySelector('.pizzaInfo--qt').innerHTML=modalQt;
    }
});

//Adjusting the click of the buttons of sizes
document.querySelectorAll('.pizzaInfo--size').forEach((size, Sizeindex)=>{
    
    size.addEventListener('click', ()=>{
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })        
});

document.querySelector('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size=parseInt(document.querySelector('.pizzaInfo--size.selected').
    getAttribute('data-key'));
    
    let identifier=pizzaJson[modalKey].id+'@'+size;
    let key=cart.findIndex((item)=>item.identifier==identifier);

    if(key>-1){
        cart[key].qt+=modalQt;
    }
    else{
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        qt:modalQt,
        size  
    });
}
    updateCart();
    closeModal();
});

function updateCart() {
    if(cart.length > 0){

        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML='';
        
        let subtotal=0;
        let desconto=0;
        let total=0;
        
        
        for(let i in cart){
            let pizzaItem=pizzaJson.find((item)=>item.id==cart[i].id);

            subtotal=pizzaItem.price*cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName='(P)';
                    break;
                case 1:
                    pizzaSizeName='(M)';
                    break;
                case 2: 
                    pizzaSizeName='(G)';
                    break;        
            }
            let pizzaName= pizzaItem.name +' '+ pizzaSizeName;
            

            cartItem.querySelector('img').src=pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML=pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML=cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt>1){
                    cart[i].qt--;
                }
                else{
                    cart.splice(i,1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            

            document.querySelector('.cart').append(cartItem);
        }
        desconto=subtotal* 0.1;
        total=subtotal-desconto;

        document.querySelector('.subtotal span:last-child').innerHTML='R$ '+subtotal.toFixed(2);
        document.querySelector('.desconto span:last-child').innerHTML='R$ '+desconto.toFixed(2);
        document.querySelector('.total span:last-child').innerHTML='R$ '+total.toFixed(2);
        
        
    }
    else{
        document.querySelector('aside').classList.remove('show');
    }
}
