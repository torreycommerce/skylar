function VariantsManager(t,e,a){var i=this;this.variants=t,this.variant_options=e,this.isCollection=a,this.product_id=this.variants[0].product_id,this.selector="[id=variation-selector-"+this.product_id+"]",this.selectsData={},this.selectedValues={},this.disabled=!1,this.outOfStock="Out of stock, please try another combination",this.getVariationSelector=function(t,e){return"[id=variation-selector-"+i.product_id+"-"+t+"-"+e+"]"},this.getSelectedValue=function(t){return"[id=selected-"+t+"-"+i.product_id+"]"},this.getProductVariation=function(t){return"[id=product-"+t+"]"},this.updateChips=function(){var t=this;$.each(t.selectsData,function(e,a){var i={};$.each(t.selectsData,function(a,s){a!=e&&t.selectedValues[a]&&(i[a]=t.selectedValues[a])});var s=t.getFilteredVariants(i),n=t.generateSelectsData(s);$.each(a,function(a,i){n[e].indexOf(i)<0?t.selectedValues[e]==i?($(t.getVariationSelector(e,i)).attr("class","notavailable-selected"),$(t.getVariationSelector(e,i)).tooltip()):($(t.getVariationSelector(e,i)).attr("class","notavailable"),$(t.getVariationSelector(e,i)).tooltip()):t.selectedValues[e]==i?($(t.getVariationSelector(e,i)).attr("class","selected"),$(t.getVariationSelector(e,i)).tooltip("destroy")):($(t.getVariationSelector(e,i)).attr("class",""),$(t.getVariationSelector(e,i)).tooltip("destroy"))}),$(t.getSelectedValue(e)).text(t.selectedValues[e])});var e=t.getFilteredVariants(t.selectedValues);1==e.length?($.each(t.variants,function(a,i){var s=t.getProductVariation(i.id),n="input[name='items["+i.id+"]']";i.id==e[0].id?($(s).show(),$(n).val(t.isCollection?0:1)):($(n).val(0),$(s).hide())}),1==this.disabled&&(this.disabled=!1,disabled_cart_button--,0==disabled_cart_button&&$("button[value=cart]").attr("disabled",!1))):0==this.disabled&&(this.disabled=!0,$("button[value=cart]").attr("disabled",!0),disabled_cart_button++)},this.updateVariants=function(t,e){var a=this;a.selectedValues[t]=e;var i=a.getFilteredVariants(a.selectedValues);if(0==i.length){var s={};s[t]=e,i=a.getFilteredVariants(s),0!=i.length&&$.each(a.selectsData,function(t,e){a.selectedValues[t]=i[0][t]})}a.updateChips()},this.generateSelectsData=function(t){var e=this,a={};return $.each(this.selectsData,function(t,e){a[t]=[]}),$.each(t,function(t,e){$.each(a,function(t,a){a.indexOf(e[t])<0&&a.push(e[t])})}),a},this.getFilteredVariants=function(t){var e=[],a=this;return $.each(this.variants,function(a,i){var s=!0;i.price>0?$.each(t,function(t,e){""!=e&&(i[t]?i[t]!=e&&(s=!1):s=!1)}):s=!1,s&&e.push(i)}),e},this.getATag=function(t,e){var a=this;return tag=$("<a>",{"class":""}).text(e)},this.getAColorTag=function(t,e,a){var i=this;return tag=$("<a>",{"class":"",style:"background-color:"+a})},this.buildChips=function(t){var e=this;$.each(t,function(t,a){if("color"==t.toLowerCase()){if(e.isCollection)var i=$("<div>",{id:"variation-selector-"+e.product_id+"-"+t,name:t,"class":"color-details-collection"});else var i=$("<div>",{id:"variation-selector-"+e.product_id+"-"+t,name:t,"class":"color-details"});var s=$("<ul>",{"class":"swatches Color"}),n=$("<span>",{"class":"selected-color"}).append($("<strong>",{}).text(t.toUpperCase()+":  "))}else var i=$("<div>",{id:"variation-selector-"+e.product_id+"-"+t,name:t,"class":"size-details"}),s=$("<ul>",{"class":"swatches-size Size"}),n=$("<span>",{"class":"selected-size"}).append($("<strong>",{}).text(t.toUpperCase()+":  "));$.each(a,function(a,i){s.append($("<li>",{id:"variation-selector-"+e.product_id+"-"+t+"-"+i,"class":"","data-tooltip":"","data-toggle":"tooltip",title:e.outOfStock}).append(e.getATag(t,i)).click(function(){e.updateVariants(t,i)}))});var o=$("<span>",{"class":"",id:"selected-"+t+"-"+e.product_id}).text("");if(i.append(n),i.append(o),i.append(s),e.isCollection)"color"==t.toLowerCase()?$(e.selector).prepend(i):$(e.selector).append(i);else{var r=$("<div>",{"class":"row no-margin"});r.append(i),"color"==t.toLowerCase()?$(e.selector).prepend(r):$(e.selector).append(r)}}),$('[data-toggle="tooltip"]').tooltip(),e.updateChips()},this.init=function(){var t=this;$.each(t.variant_options,function(e,a){t.selectsData[a]=[]}),$.each(t.variants,function(e,a){$.each(t.selectsData,function(t,e){e.indexOf(a[t])<0&&e.push(a[t])})});var e=null;$.each(t.variants,function(t,a){return console.log(a),a.price>0?(e=a,!1):void 0}),$.each(t.selectsData,function(a,i){t.selectedValues[a]=e[a]}),t.buildChips(t.selectsData)}}$(function(){VariantsData.isCollection?$.each(VariantsData.products,function(t,e){new VariantsManager(e.variants,e.variant_options,!0).init()}):new VariantsManager(VariantsData.products[0].variants,VariantsData.products[0].variant_options,!1).init()});var disabled_cart_button=0;