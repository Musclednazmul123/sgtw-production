/**
 * Instant search & filters v1.0.0
 **/

 window.UpsellLiquid = window.UpsellLiquid || {};

 window.UPSELL = (function() {
     var config = {
         URL: "https://2416-39-59-27-150.ngrok.io",
         API_KEY: UpsellLiquid.api_key || "not-found",
         log: "log"
     };
 
     var icons = {
         'times': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>',
         'shopping_cart': '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-cart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-shopping-cart fa-w-18 fa-3x"><path fill="currentColor" d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z" class=""></path></svg>',
         'shoppping_bag': '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shopping-bag" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-shopping-bag fa-w-14 fa-3x"><path fill="currentColor" d="M352 160v-32C352 57.42 294.579 0 224 0 153.42 0 96 57.42 96 128v32H0v272c0 44.183 35.817 80 80 80h288c44.183 0 80-35.817 80-80V160h-96zm-192-32c0-35.29 28.71-64 64-64s64 28.71 64 64v32H160v-32zm160 120c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zm-192 0c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24z" class=""></path></svg>',
     };
 
     var select_attribute = {
         "wrapper": ".upsell_wrapper",
         "products": ".upsell_products",
         "contents": ".upsell_contents",
         "header": ".upsell_header",
     };
 
     var select_frequently_attribute = {
         "wrapper": ".isf-frequently-bought-container",
         "products": ".isf-frequently-bought-products",
         "products_contents": ".isf-frequently-bought-selector-list",
         "contents": ".isf-frequently-bought-recommendations-container",
 
     };
 
     var select_recently_attribute = {
         "wrapper": ".recently_wrapper",
         "products": ".recently_products",
         "products_contents": ".recently-list",
 
     };
 
     var HttpRequest = new XMLHttpRequest();
     var isMobile = $SH("body").width() <= 576;
 
     // Add to cart
     function addToCart(el, items) {
         var formData = {
             'items': items
         };
         $SH(el).attr("disabled", "disabled");
         $SH(el).text("Adding...");
         $SH.ajax({
             url: UpsellLiquid.routes.cart_add_url,
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             data: JSON.stringify(formData),
             success: function(response) {
                 // setTimeout(() => {
                 //     $SH(el).removeAttr("disabled", "disabled");
                 //     $SH(el).text("Add to cart");
                 // }, 2500);
                 // $SH(el).text("Added to cart");
                 window.location.replace("/cart");
             },
             error: function(error) {
                 console.log("product Not Addedd !");
                 $('.isf-frequently-bought-add-button').after("<div class='soldout_error'>Products are sold out !</div>");
                  setTimeout(function(){
                    $('.soldout_error').remove();
                  }, 3000);
                 $SH(el).addClass("Error");
                 setTimeout(() => {
                     $SH(el).removeAttr("disabled", "disabled");
                     $SH(el).text("Add to cart");
                 }, 2500);
             }
         });
         $SH('form#vid-' + $SH(this).attr("data-vid")).trigger('submit');
     }
 
     String.prototype.replaceText = function(search, replacement) {
         return this.split(search).join(replacement);
     };
 
     function formatMoney(cents, format) {
         if (typeof cents === 'string') {
             cents = cents.replace('.', '');
         }
         var value = '';
         var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
         var formatString = format || UpsellLiquid.shopInfo.money_format;
 
         function formatWithDelimiters(number, precision, thousands, decimal) {
             thousands = thousands || ',';
             decimal = decimal || '.';
             if (isNaN(number) || number === null) {
                 return 0;
             }
             number = (number / 100.0).toFixed(precision);
             var parts = number.split('.');
             var dollarsAmount = parts[0].replace(/(d)(?=(ddd)+(?!d))/g, '$1' + thousands);
             var centsAmount = parts[1] ? decimal + parts[1] : '';
             return dollarsAmount + centsAmount;
         }
         switch (formatString.match(placeholderRegex)[1]) {
             case "amount":
                 value = formatWithDelimiters(cents, 2);
                 break;
             case "amount_no_decimals":
                 value = formatWithDelimiters(cents, 0);
                 break;
             case "amount_with_comma_separator":
                 value = formatWithDelimiters(cents, 2, ".", ",");
                 break;
             case "amount_no_decimals_with_comma_separator":
                 value = formatWithDelimiters(cents, 0, ".", ",");
                 break;
             case "amount_no_decimals_with_space_separator":
                 value = formatWithDelimiters(cents, 0, " ");
                 break;
             case "amount_with_apostrophe_separator":
                 value = formatWithDelimiters(cents, 2, "'");
                 break
         };
         return formatString.replace(placeholderRegex, value);
     }
 
     function percentSale(price, compare_at_price) {
         if (isNaN(price) || isNaN(compare_at_price)) {
             return 0;
         }
         var sale = Math.round(100 - ((Number(price) / Number(compare_at_price)) * 100));
         return sale > -1 ? sale : 0;
     }
 
     function stripHtml(html) {
         var tmp = document.createElement("DIV");
         tmp.innerHTML = html;
         return tmp.textContent || tmp.innerText || "";
     }
 
     function log(a, b, c, d, e, f) {
         if (config.log) {
             try {
                 console[config.log](a ? a : "", b ? b : "", c ? c : "", d ? d : "", e ? e : "", f ? f : "");
             } catch (e) {}
         }
     }
 
     function firstAvailableVariant(product) {
         var variants = product.variants,
             variant = null;
         for (var index = 0; index < variants.length; index++) {
             var v = variants[index];
             if (v && v.available) {
                 variant = v;
                 break;
             }
         }
         if (!variant && variants && variants[0]) {
             variant = variants[0];
         }
         return variant;
     }
 
     function imageSrcSet(image) {
         var srcset = '';
         var sizes = ["180", "360", "540", "720", "900", "1080", "1296", "1512", "1600"];
         for (var index = 0; index < sizes.length; index++) {
             var size = sizes[index];
             srcset += resizeImage(image, size + "x") + " " + (size) + "w";
             if (index + 1 !== sizes.length) {
                 srcset += ",";
             }
         }
         return srcset;
     }
 
     function resizeImage(image, size, crop) {
         if (!size) {
             size = '680x';
         }
         if (crop) {
             size += "_crop_" + crop;
         }
         if (image) {
             if (image.indexOf(".jpg") > -1) {
                 var n = image.lastIndexOf(".jpg");
                 image = image.substring(0, n) + "_" + size + image.substring(n);
             } else if (image.indexOf(".png") > -1) {
                 var n = image.lastIndexOf(".png");
                 image = image.substring(0, n) + "_" + size + image.substring(n);
             } else if (image.indexOf(".gif") > -1) {
                 var n = image.lastIndexOf(".gif");
                 image = image.substring(0, n) + "_" + size + image.substring(n);
             }
             return image;
         } else {
             return "https://cdn.shopify.com/s/images/admin/no-image-large.gif?da5ac9ca38617f8fcfb1ee46268f66d451ca66b4";
         }
     }
 
     function hoverImage(images) {
         var img = null;
         if (images && images.length > 1) {
             img = images[1];
         }
         return img;
     }
 
     function isProductAvailable(product) {
         var a = false;
         if (product) {
             if (typeof product.available !== "undefined") {
                 a = product.available;
             } else if (typeof product.isAvailable !== "undefined") {
                 a = product.isAvailable;
             } else if (typeof product === "object") {
                 product.variants.forEach(function(variant, index) {
                     if (variant.inventory_quantity > 0 || variant.inventory_policy == "continue") {
                         a = true;
                     } else if (!variant.inventory_management) {
                         a = true;
                     }
                 });
             }
         }
         return a;
     }
 
     function money_format(n) {
         if (typeof n === "string") {
             n = n.replace(",", "")
         }
         n = Number(n) / 100;
         return n;
     }
 
     function rstring(length) {
         var mask = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
         var result = '';
         for (var i = length || 4; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
         try {
             result = result.toLowerCase();
         } catch (e) {}
         return result;
     }
 
     function getPrice(variant) {
         var _price = '';
         var sale = false;
         if (variant) {
             if (Number(variant.price) < Number(variant.compare_at_price)) {
                 sale = true;
                 _price = '<div class="upsell__price on_sale">\
                     <span class="upsell_unit__price">' + formatMoney(variant.price) + '</span>\
                     <d class="upsell_was__price">' + formatMoney(variant.compare_at_price) + '</d>\
                 </div>';
             } else {
                 _price = '<div class="upsell__price">\
                     <span class="upsell_unit__price">' + formatMoney(variant.price) + '</span>\
                 </div>';
             }
         }
         return _price;
     }
 
     function getActions(product) {
         var _actions = '';
         if (product && product.available) {
             var variant = firstAvailableVariant(product);
             _actions = '<button data-id="' + variant.id + '" class="upsell_btn upsel_btn__soldout">Add to cart</button>';
         } else {
             _actions = '<button class="upsell_btn upsel_btn__soldout" disabled>Sold Out</button>';
         }
         return '<div class="actions">' + _actions + '</div>';
     }
 
     function render_products(products) {
         products.forEach((product, index) => {
             var variant = firstAvailableVariant(product);
             var _html = '<li class="upsell_item">\
                 <a href="/products/' + product.handle + '">\
                     <div class="upsell_image_wrapper">\
                         <img class="upsell_image" src="' + resizeImage(product.featured_image, "144x144") + '" alt="' + product.title + '">\
                     </div>\
                     <div class="upsell_item_info" product-id="' + product.id + '" product-price="' + product.price + '" product-uid="' + response.active_offer.uid + '">\
                         <div class="upsell_item_link">' + product.title + '</div>\
                         <div class="upsell_item_price">' + getPrice(variant) + '</div>\
                     </div>\
                 </a>\
                 <div class="upsell_actions">' + (getActions(product)) + '</div>\
             </li>';
             $SH(select_attribute.products).append(_html);
         });
     }
 
     function plus_sign(index) {
         if (index === 0) {
             return '';
 
         } else {
             return '<div class="isf-frequently-bought-plus-icon"> + </div>';
         }
     }
 
     function render_frequently_products(products) {
         var sum_prices_arr = [];
         products.forEach((product, index) => {
             var _cls = 'variant_select_' + rstring();
             var price = 0;
             var variant = firstAvailableVariant(product);
             price += variant.price;
             var _html = '<li class="isf-frequently-bought-product show" product-handle="' + product.handle + '">\
                             <p index="' + index + '">' + plus_sign(index) + '</p>\
                           <a class="isf-frequently-bought-product-image-link" href="/products/' + product.handle + '">\
                                   <img src="' + resizeImage(product.featured_image, "200x200") + '" alt="' + product.title + '">\
                               </div>\
                           </a>\
                       </li>';
             var _html2 = '<li class="show" data-price="' + money_format(variant.price) + '" variant-id="' + variant.id + '" product-handle="' + product.handle + '">\
                         <input type="checkbox" class="isf-frequently-bought-selector-input" id="" name="product_3964692660285" aria-label="Selection of SRAM Omnium Track Crankset and Bottom Bracket" checked="checked">\
                         <span class="translatable" for="">\
                             <a href="/products/' + product.handle + '">\
                               <h3 class="isf-frequently-bought-selector-label-name">\
                                 <strong>' + product.title + '</strong>\
                               </h3>\
                             </a>\
                         </span>' + productOptions(product, variant, _cls) + '\
                         <span class="isf-frequently-bought-selector-label-sale-price">\
                             <span class="money">' + formatMoney(variant.price) + '</span>\
                         </span>\
                     </li>';
 
             $SH('.isf-frequently-bought-container').attr('product-uid', response.active_offer.uid);
             sum_prices_arr.push(price);
             $SH(select_frequently_attribute.products).append(_html);
             $SH(select_frequently_attribute.products_contents).append(_html2);
 
         });
         $SH(".isf-frequently-bought-total-price-sale-price .money").text(formatMoney(sum_prices_arr.reduce(function(a, b) {
             return a + b;
         }, 0)));
         $SH('.isf-frequently-bought-total-price-sale-price').attr('subtotal', sum_prices_arr.reduce(function(a, b) {
             return a + b;
         }, 0) / 100);
         UPSELL.frequently_viewed();
     }
 
     function productOptions(product, selected_variant, _cls) {
         if (product.options && product.variants && product.variants.length > 1) {
             var html = '<select name="id" id="' + _cls + '">';
             product.variants.forEach(variant => {
                 var _isSelected = '';
                 if (selected_variant.id == variant.id) {
                     _isSelected = 'selected="selected"';
                 }
                // data-image="' + variant.featured_image.src + '"
               function variant_image(){
                 if(variant.featured_image == null){
                   return '';
                 }
                 else{
                   return variant.featured_image.src;
                 }
               }
                 if (variant.available) {
                     html += '<option value="' + variant.id + '" data-image="' + variant_image() + '" ' + _isSelected + ' data-available="' + variant.available + '" option1="' + variant.option1 + '" option2="' + variant.option2 + '" option3="' + variant.option3 + '" data-price="' + variant.price + '">' + variant.title + '</option>';
                 } else {
                     html += '<option value="' + variant.id + '" disabled="disabled" ' + _isSelected + ' data-available="' + variant.available + '" option1="' + variant.option1 + '" option2="' + variant.option2 + '" option3="' + variant.option3 + '" data-price="' + variant.price + '">' + variant.title + '</option>';
                 }
             });
             html += '</select>';
             html += '<script type="application/json" data-product-id="' + product.id + '">' + JSON.stringify(product.variants) + '</script>';
             return html;
         }
         return '';
     }
 
     function ImgChange(handle, src) {
       if(src.length !== 0){
         $SH('.isf-frequently-bought-products [product-handle="' + handle + '"]').find('img').attr('src', src);
       }
     }
 
     $SH(document).on('change', 'select[name="id"]', function() {
         $SH(this).find('[selected="selected"]').removeAttr('selected');
         var value = $SH(this).val();
         $SH(this).find('option[value="' + value + '"]').attr("selected", "selected");
         var var_price = $SH(this).find('option[value="' + value + '"]').attr('data-price');
         $SH(this).parents('li').find('.isf-frequently-bought-selector-label-sale-price .money').text(formatMoney(var_price));
         $SH(this).parents('li').attr('data-price', var_price / 100);
         $SH(this).parents('li').attr('variant-id', value);
         var li_prices_arr = [];
         $SH('.isf-frequently-bought-selector-list li.show').each(function() {
             var li_price = Number($SH(this).attr('data-price'));
             li_prices_arr.push(li_price);
         });
         var prices_sum = li_prices_arr.reduce(function(a, b) {
             return a + b;
         }, 0);
         $SH('.isf-frequently-bought-total-price-sale-price').text(formatMoney(prices_sum * 100));
         $SH('.isf-frequently-bought-total-price-sale-price').attr('subtotal', prices_sum);
         var data_image = $(this).find('[selected="selected"]').attr('data-image');
         var this_handle = $SH(this).parents('li').attr('product-handle');
         ImgChange(this_handle, data_image);
     });
 
     function ImgToggle(handle, type) {
         $SH('.isf-frequently-bought-products [product-handle="' + handle + '"]')[type]();
     }
     $SH(document).on("change", '.isf-frequently-bought-selector-list input[type=checkbox]', function() {
 
         setTimeout(function() {
             $SH('.isf-frequently-bought-product:not([style="display: none;"])').each(function(index) {
                 if (index == 0) {
                     $SH(this).find('.isf-frequently-bought-plus-icon').hide();
                 } else {
                     $SH(this).find('.isf-frequently-bought-plus-icon').show();
                 }
             });
         }, 10);
         var this_handle = $SH(this).parents('li').attr('product-handle');
         if (this.checked) {
             $SH(this).parents('li').addClass('show');
             $SH(this).parents('li').removeClass('hide');
             ImgToggle(this_handle, "show");
             var prod_price = $SH(this).parents('li').attr('data-price');
 
             var subtotal = $SH('.isf-frequently-bought-total-price-sale-price').attr('subtotal');
 
             var add_to_subtotal = Number(subtotal) + Number(prod_price);
             $SH('.isf-frequently-bought-total-price-sale-price').attr('subtotal', add_to_subtotal);
             $SH('.isf-frequently-bought-total-price-sale-price').text(formatMoney(add_to_subtotal * 100));
         } else {
             ImgToggle(this_handle, "hide");
             $SH(this).parents('li').removeClass('show');
             $SH(this).parents('li').removeClass('hide');
             var prod_price = $SH(this).parents('li').attr('data-price');
             var subtotal = $SH('.isf-frequently-bought-total-price-sale-price').attr('subtotal');
 
             var minus_to_subtotal = (Number(subtotal) - Number(prod_price));
             $SH('.isf-frequently-bought-total-price-sale-price').attr('subtotal', minus_to_subtotal);
             $SH('.isf-frequently-bought-total-price-sale-price').text(formatMoney(minus_to_subtotal * 100));
         }
         if ($SH('li.isf-frequently-bought-product[style="display: none;"]').length == response.active_offer.matching_products.length) {
             $SH('.isf-frequently-bought-add-button').attr("disabled", "disabled");
         } else {
             $SH('.isf-frequently-bought-add-button').removeAttr("disabled", "disabled");
         }
         if ($SH(".isf-frequently-bought-selector-list li.show").length == 1) {
             $SH(".isf-frequently-bought-selector-list li.show").find('[type="checkbox"]').attr("disabled", "disabled");
         } else {
             $SH(".isf-frequently-bought-selector-list li.show").find('[type="checkbox"]').removeAttr("disabled");
         }
     });
 
     function getTemplate(template, upsell_types) {
         // debugger;
         var _valid = false;
         switch (template) {
             case "product":
                 _valid = upsell_types.upsell_product_page === true;
                 break;
             case "cart":
                 _valid = upsell_types.upsell_in_cart === true;
                 break;
             default:
                 break;
         }
         return _valid;
     }
 
     function isTrigger(arr, product_id) {
         // debugger;
         var _isTriggered = false;
         if (!product_id) return false;
         if (!arr) return false;
         if (arr && (typeof arr !== "object" || arr.length === 0)) return false;
         try {
             _isTriggered = arr.findIndex(function(x, i) {
                 return x.id == product_id
             }) > -1;
         } catch (e) {}
         return _isTriggered;
     }

      function isTriggerArr(arr1, arr2) {
         // debugger;
         var _isTriggered = false;
         if (!arr2) return false;
         if (!arr1) return false;
        for (let index = 0; index < arr1.length; index++) {
            try {
                _isTriggered = arr2.findIndex(function(x, i) {
                    return x = index;
                }) > -1;
            } catch (e) {}
            if (_isTriggered) { break; }
        }
        return _isTriggered;
     }
 
     function getTemplate(template, upsell_types) {
         //         debugger;
         var _valid = false;
         switch (template) {
             case "product":
                 _valid = upsell_types.upsell_product_page === true;
                 break;
             case "cart":
                 _valid = upsell_types.upsell_in_cart === true;
                 break;
             default:
                 break;
         }
         return _valid;
     }
 
     function getMatchingProducts(params, callback) {
         //         debugger;
         if (!params) {
             return null;
         }
         var product_id = params.product_id;
         var product_handle = params.product_handle;
         var product_tags = params.product_tags;
         var template = params.template;
         var active_offer = {};
         var array_r = [];
         if (params.upsell) {
             array_r = UpsellLiquid.Offers;
         } else {
             array_r = UpsellLiquid.upsell_frequently;
         }
         for (var index = 0, leng = array_r.length; index < leng; index++) {
             //           debugger;
             var offer = array_r[index]; 
             //                   debugger;
             if (getTemplate(template, {
                     upsell_in_cart: offer.upsell_in_cart,
                     upsell_product_page: offer.upsell_product_page,
                 })) {
                 if (isTrigger(offer.trigger_products, product_id)) {
                     active_offer = offer;
                     break;
                 }
               if (isTriggerArr(offer.trigger_tags, product_tags)) {
                     active_offer = offer;
                     break;
                 }
             }
         }
         if (typeof callback === "function") {
             if (active_offer.uid) {
                 return callback({
                     product_id: product_id,
                     product_handle: product_handle,
                     active_offer: active_offer
                 });
             } else {
                 return callback({
                     error: true,
                     message: "Not found",
                     active_offer: {}
                 });
             }
         }
     }
 
     function getProductByHandle(handle, callback) {
         var request_config = {
             method: 'GET',
             url: "/products/" + handle + ".js",
             headers: {
                 "Content-Type": "application/json"
             },
             success: function(response) {
                 if (typeof callback === "function") {
                     try {
                         response = JSON.parse(response);
                     } catch (e) {}
                     return callback(response);
                 }
             },
             error: function(error) {
                 if (typeof callback === "function") {
                     return callback(null, error);
                 }
             }
         };
         $SH.ajax(request_config);
     }
 
     $SH(document).on("click", ".isf-frequently-bought-add-button", function() {
         var items = [];
         var cart_added_items = [];
         var product_uid = $SH('.isf-frequently-bought-container').attr('product-uid');
         $SH('.isf-frequently-bought-selector-list li.show').each(function() {
             var variant_id = $SH(this).attr('variant-id');
             items.push({
                 id: variant_id,
                 quantity: 1
             });
             cart_added_items.push({
                 id: variant_id
             });
         });
         addToCart(this, items);
         frequentlyCart({
             "shop": UpsellLiquid.shopInfo.shop,
             "uid": product_uid,
             "product_id": response.product_id,
             "cart_added": cart_added_items,
             "product_price": "15"
         });
     });
 
     function addClick(params) {
         var request_config = {
             method: 'POST',
             url: config.URL + "/api/v/1/add_click",
             headers: {
                 "Content-Type": "application/json"
             },
             data: JSON.stringify(params),
             success: function(response) {},
             error: function(error) {}
         };
         $SH.ajax(request_config);
     }
 
     function frequentlyCart(params) {
         var request_config = {
             method: 'POST',
             url: config.URL + "/api/v/1/frequently_added_cart",
             headers: {
                 "Content-Type": "application/json"
             },
             data: JSON.stringify(params),
             success: function(response) {},
             error: function(error) {}
         };
         $SH.ajax(request_config);
     }
 
     function frequentlyView(params) {
       
         var request_config = {
             method: 'POST',
             url: config.URL + "/api/v/1/add_frequently_view",
             headers: {
                 "Content-Type": "application/json"
             },
             data: JSON.stringify(params),
             success: function(response) {console.log("Frequently View Added !");},
             error: function(error) {}
         };
         $SH.ajax(request_config);
     }
 
     function addConversion(trigger_id, template) {
         var request_config = {
             method: 'POST',
             url: config.URL + "/get_product_matchings",
             headers: {
                 "Content-Type": "application/json"
             },
             data: JSON.stringify({
                 "store_name": "demo_store",
                 "trigger_id": trigger_id,
                 "template": template
             }),
             success: function(response) {},
             error: function(error) {}
         };
         $SH.ajax(request_config);
     }
 
     function UpsellWidget() {
         UPSELL.getMatchingProducts({
             product_id: UpsellLiquid.product_id,
             product_handle: UpsellLiquid.product_handle,
             product_tags: UpsellLiquid.product_tags,
             template: UpsellLiquid.template,
             upsell: true
         }, function(response) {
             window.upsell_response = response;
             console.log("UpsellWidget",upsell_response);
             var count = 0;
             var render_products_data = [];
 
             function _this(matching_product) {
                 UPSELL.getProductByHandle(matching_product.handle, function(product, error) {
                     if (product) {
                         render_products_data.push(product);
                     }
                     count++;
                     if (upsell_response.active_offer.matching_products[count]) {
                         _this(upsell_response.active_offer.matching_products[count]);
                     } else {
                         $SH(UpsellLiquid.upsell_html).insertAfter(UpsellLiquid.upsell_template_selector);
                         render_products(render_products_data);
                     }
                 });
             }
             if (upsell_response && upsell_response.active_offer && upsell_response.active_offer.matching_products) {
                 _this(upsell_response.active_offer.matching_products[count]);
             }
         });
     }
 
     function FBTWidget() {
         UPSELL.getMatchingProducts({
             product_id: UpsellLiquid.product_id,
             product_handle: UpsellLiquid.product_handle,
             template: UpsellLiquid.template
         }, function(response) {
             // debugger; 
             window.response = response;
           console.log("FBT",response);
             var count = 0;
             var render_products_data = [];
 
             function _this(matching_product) {
                 UPSELL.getProductByHandle(matching_product.handle, function(product, error) {
                     if (product) {
                         render_products_data.push(product);
                     }
                     count++;
                     if (response.active_offer.matching_products[count]) {
                         _this(response.active_offer.matching_products[count]);
                     } else {
                         $SH(UpsellLiquid.frequently_html).insertAfter(UpsellLiquid.frequently_template_selector);
                         render_frequently_products(render_products_data);
                     }
                 });
             }
             if (response && response.active_offer && response.active_offer.matching_products) {
                 _this(response.active_offer.matching_products[count]);
             }
         });
     }
 
     // Cookies
 
     var $_slider = {
         dots: true,
         infinite: true,
         speed: 400,
         slidesToShow: 5,
         slidesToScroll: 5,
         swipeToSlide: true,
         prevArrow: '<div class="slick-prev slick-arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"/></svg></div>',
         nextArrow: '<div class="slick-next slick-arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"/></svg></div>',
         responsive: [{
                 breakpoint: 1024,
                 settings: {
                     slidesToShow: 4,
                     slidesToScroll: 5,
                     infinite: true,
                     dots: true,
                 }
             },
             {
                 breakpoint: 600,
                 settings: {
                     slidesToShow: 2,
                     slidesToScroll: 2,
                     dots: true,
                 }
             },
             {
                 breakpoint: 480,
                 settings: {
                     slidesToShow: 1,
                     slidesToScroll: 1,
                     dots: false,
                 }
             }
         ]
     };
   
     function render_recently_products(products) {
         products.forEach((product, index) => {
             var price = 0;
             var variant = firstAvailableVariant(product);
             price += variant.price;
             var recently = UpsellLiquid.upsell_recently[0];
 
             function recent_price() {
                 if (recently.price == false) {
                     return '';
                 } else {
                     return '<span class="recently_item_price">' + formatMoney(variant.price) + '</span>';
                 }
             }
 
             function recent_vendor() {
                 if (recently.vendor == false) {
                     return '';
                 } else {
                     return '<div class="recently_item_vendor">' + product.vendor + '</div>';
                 }
             }
 
             function recent_title() {
                 if (recently.title == false) {
                     return '';
                 } else {
                     return '<div class="recently_item_title">' + product.title + '</div>';
                 }
             }
 
             function recent_addToCart() {
                 if (recently.addtocart == false) {
                     return '';
                 } else {
                     return '<div class="recently_actions">' + (getActions(product)) + '</div>';
                 }
             }
 
             var recentl_html = '<li class="recently_item">\
                 <a href="/products/' + product.handle + '">\
                     <div class="recently_image_wrapper">\
                         <img class="recently_image" src="' + resizeImage(product.featured_image, "230x230") + '" alt="' + product.title + '">\
                     </div>\
                         <div class="recently_item_info" product-id="' + product.id + '" product-price="' + product.price + '">\
                         ' + recent_vendor(recently.vendor) + '\
                         ' + recent_title() + '\
                         ' + recent_price() + '\
                     </div>\
                 </a>\
                 ' + recent_addToCart() + '\
             </li>';
             $SH(select_recently_attribute.products).append(recentl_html);
         });
     }
 
     $SH(document).on("click", ".recently_actions .upsell_btn,.upsell_actions .upsell_btn", function() {
       console.log("clicked")
         var vid = $(this).attr('data-id');
         var item = [{
             id: vid,
             quantity: 1
         }];
         addToCart(this, item);
     });

     $SH(window).on('load', function() {
       if(UpsellLiquid.template == "cart"){
          
       }
      });
 
     function getCookie(cname) {
         const name = cname + "=";
         const cDecoded = decodeURIComponent(document.cookie); //to be careful
         const cArr = cDecoded.split('; ');
         let res;
         cArr.forEach(val => {
             if (val.indexOf(name) === 0) res = val.substring(name.length);
         })
         return res
     }
 
     var _cookie = getCookie('upsell_recently_viewed');
 
     if (_cookie != undefined) {
         var arr = JSON.parse(_cookie);
         count = 0;
         var render_products_data = [];
 
         function _this(recently_product) {
             getProductByHandle(recently_product, function(product, error) {
                 if (product) {
                     render_products_data.push(product);
                 }
                 count++;
                 if (arr[count]) {
                     _this(arr[count]);
                 } else {
                     if (UpsellLiquid.recently_template_selector == 'main') {
                         $SH(UpsellLiquid.recently_html).insertAfter(UpsellLiquid.recently_template_selector);
                     } else {
                         $SH(UpsellLiquid.recently_html).insertBefore(UpsellLiquid.recently_template_selector);
                     }
                     render_recently_products(render_products_data);
                     // function call
                     $SH('.recently_products').slick($_slider);
                     if (-1 === arr.findIndex(x => x == UpsellLiquid.product_handle) && UpsellLiquid.template == 'product') {
                         arr.push(UpsellLiquid.product_handle);
                         var json_str = JSON.stringify(arr);
                         document.cookie = "upsell_recently_viewed=" + json_str + ";path=/";
                     }
                 }
             });
         }
         if (arr.length > 0) {
             _this(arr[count]);
         }
 
     } else {
         var arr = [];
         arr.push(UpsellLiquid.product_handle);
         var json_str = JSON.stringify(arr);
         document.cookie = "upsell_recently_viewed=" + json_str + ";path=/";
 
     }
 
     // end Cookies
 
     function frequently_viewed() {
         if ($SH('.isf-frequently-bought-container').length == 1 && !UPSELL.viewAdded) {
             var cursorTop = $SH(window).scrollTop();
             var totalScreenHeight = window.innerHeight;
             var fromTop = Number($SH('.isf-frequently-bought-container').offset().top) - 200;
             var elHeight = Number($SH('.isf-frequently-bought-container').outerHeight()) / 2;
             var fromBottom = fromTop + elHeight;
             var viewPosition = Number(fromTop) + Number(elHeight) - Number(totalScreenHeight);
             if (Number(cursorTop) >= Number(fromTop) && Number(cursorTop) <= Number(fromBottom)) {
                 var product_uid = $SH('.isf-frequently-bought-container').attr('product-uid');
                 $SH(window).unbind('scroll');
                 UPSELL.viewAdded = true;
                 frequentlyView({
                     "shop": UpsellLiquid.shopInfo.shop,
                     "uid": product_uid,
                     "product_id": response.product_id,
                     "product_price": "15"
                 });
             }
         }
     }
 
     function init() {
         if (UpsellLiquid.template == "product") {
             UpsellWidget();
             FBTWidget();
             frequently_viewed();
         } else {
             var _c = 0;
 
             function _cartSelf(cart_item) {
                 var product_id = cart_item.product_id;
                 var product_handle = cart_item.handle;
 
                 UPSELL.getMatchingProducts({
                     product_id: product_id,
                     product_handle: product_handle,
                     template: UpsellLiquid.template
                 }, function(response) {
                     window.response = response;
                     var count = 0;
                     var render_products_data = [];
 
                     function _this(matching_product) {
                         UPSELL.getProductByHandle(matching_product.handle, function(product, error) {
                             if (product) {
                                 render_products_data.push(product);
                             }
                             count++;
                             if (response.active_offer.matching_products[count]) {
                                 _this(response.active_offer.matching_products[count]);
                             } else {
                                 $SH(UpsellLiquid.frequently_html).insertAfter(UpsellLiquid.frequently_template_selector);
                                 render_frequently_products(render_products_data);
                             }
                         });
                     }
                     if (response && response.active_offer && response.active_offer.matching_products) {
                         _this(response.active_offer.matching_products[count]);
                     } else {
                         _c++;
                         if (UpsellLiquid.CartItems && UpsellLiquid.CartItems[_c]) {
                             _cartSelf(UpsellLiquid.CartItems[_c]);
                         } else {}
                     }
                 });
             }
             if (UpsellLiquid.CartItems && UpsellLiquid.CartItems[_c]) {
                 _cartSelf(UpsellLiquid.CartItems[_c]);
             }
 
         }
     }
 
     $SH(window).on('scroll', function() {
         frequently_viewed();
     });
 
     $SH(document).on('click', '.upsell_products .upsell_item', function() {
         var _this = $SH(this);
         var product_id = _this.find('.upsell_item_info').attr('product-id');
         var product_uid = _this.find('.upsell_item_info').attr('product-uid');
         addClick({
             "shop": UpsellLiquid.shopInfo.shop,
             "uid": product_uid,
             "product_id": product_id,
             "product_price": "15"
         });
     });
 
     function errorHandler() {}
     return {
         addToCart: addToCart,
         init: init,
         getMatchingProducts: getMatchingProducts,
         getProductByHandle: getProductByHandle,
         frequently_viewed: frequently_viewed
     }
 })();
 
 if (UPSELL && typeof UPSELL.init == "function") {
     UPSELL.init();
 } else {
     console.warn("Shop details not available");
 }