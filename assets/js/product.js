$(function() {
    if(VariantsData.isCollection){
        $.each(VariantsData.products, function(index, product){
            new VariantsManager(product.variants, product.variant_options, true).init();
        });
    }else{
        new VariantsManager(VariantsData.products[0].variants, VariantsData.products[0].variant_options, false).init();
    }
});

var disabled_cart_button = 0;

function VariantsManager (variants, variant_options, isCollection) {
    var self = this;
    this.variants = variants;
    this.variant_options = variant_options;
    this.isCollection = isCollection;
    this.product_id = this.variants[0].product_id;
    this.selector = "[id=variation-selector-"+this.product_id+"]";
    this.selectsData = {};
    this.selectedValues = {};
    this.disabled = false;
    this.outOfStock = "Out of stock, please try another combination";

    this.jqSelector = function(str){
        var temp = str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
        return temp;
    }

    this.getVariationSelector = function(selectName, optionValue){
        selectName = selectName.replace(/ /g, "-");
        optionValue = optionValue.replace(/ /g, "-");
        return "[id=variation-selector-"+ this.jqSelector(self.product_id+"-"+selectName+"-"+optionValue) +"]";
    }
    this.getVariationValueId = function(selectName, optionValue){
        selectName = selectName.replace(/ /g, "-");
        optionValue = optionValue.replace(/ /g, "-");
        return "variation-selector-"+this.product_id+"-"+selectName+"-"+optionValue;
    }
    this.getVariationOptionId = function(selectName){
        selectName = selectName.replace(/ /g, "-");
        return "variation-selector-"+this.product_id+"-"+selectName;
    }
    this.getVariationSelectedId = function(selectName){
        selectName = selectName.replace(/ /g, "-");
        return "selected-"+selectName+"-"+this.product_id;
    }
    
    this.getSelectedValue = function(selectName){
        selectName = selectName.replace(/ /g, "-");
        return "[id=selected-"+ this.jqSelector(selectName+"-"+self.product_id) +"]";
    }
    this.getProductVariation = function(variant_id){
        return "[id=product-" + variant_id + "]";
    }

    this.updateChips = function(){
        var self = this;
        $.each(self.selectsData, function(name, optionArray){
            var selectedValues2 = {};

            $.each(self.selectsData, function(name2, optionArray2){
                if(name2 != name){
                    if(self.selectedValues[name2]){
                        selectedValues2[name2] = self.selectedValues[name2];
                    }
                }
            });

            var filteredVariants = self.getFilteredVariants(selectedValues2);
            var generatedSelectsData = self.generateSelectsData(filteredVariants);

            $.each(optionArray, function(index, value){

                if(generatedSelectsData[name].indexOf(value) < 0){
                    if(self.selectedValues[name] == value){
                        // Selected, not available
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable-selected");
                        $(self.getVariationSelector(name, value)).tooltip();
                    }else{
                        //not selected not available
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable");
                        $(self.getVariationSelector(name, value)).tooltip();
                    }
                }else{
                    if(self.selectedValues[name] == value){
                        //Selected, available
                        $(self.getVariationSelector(name, value)).attr("class", "selected");
                        $(self.getVariationSelector(name, value)).tooltip("destroy");
                    }else{
                        //not Selected available
                        $(self.getVariationSelector(name, value)).attr("class", "");
                        $(self.getVariationSelector(name, value)).tooltip("destroy");
                    }
                }
            });

            //Update option value selected
            $(self.getSelectedValue(name)).text(self.selectedValues[name]);

        });

        //hide and show variant div to display proper variant picture
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 1){
            
            //hide and show proper variant, set quantity inputs
            $.each(self.variants, function(index, variant){
                var id = self.getProductVariation(variant.id);
                var quantityInput = "input[name='items["+ variant.id +"]']";
                if(variant.id == filteredVariants[0].id){
                    $(id).show();
                    if(self.isCollection){
                        $(quantityInput).val(0);
                    }else{
                        $(quantityInput).val(1);
                    }
                }else{
                    $(quantityInput).val(0);
                    $(id).hide();
                }
            });

            //Disable/Enable button according to variants availability
            if(self.isCollection){
                if(this.disabled == true){
                    this.disabled = false;
                    disabled_cart_button--;
                    if(disabled_cart_button == 0){
                        self.disableAddToCart(false);
                    }
                }
            }else{
                if(filteredVariants[0].has_stock){
                    self.disableAddToCart(false);
                }else{
                    self.disableAddToCart(true);
                } 
            }
        }else{
            if(self.isCollection){
                if(this.disabled == false){
                    this.disabled = true;
                    self.disableAddToCart(true);
                    disabled_cart_button++;
                }
            }else{
                self.disableAddToCart(true);
            }
        }
    }

    this.disableAddToCart = function(boolean){
        $('button[value=cart]').attr('disabled',boolean);
        $('button[value=registry]').attr('disabled',boolean);
        $('button[value=wishlist]').attr('disabled',boolean);
    }

    this.updateVariants = function(selectName, optionValue){
        var self = this;

        self.selectedValues[selectName] = optionValue;
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 0 ){
            // display the default variant evalable 
            var temp = {};
            temp[selectName] = optionValue;
            filteredVariants = self.getFilteredVariants( temp );
            //Default selected variant with the new selected value
            if(filteredVariants.length != 0){
                $.each(self.selectsData, function(selectName, optionArray){
                    self.selectedValues[selectName] = filteredVariants[0][selectName];
                });
            }
        }
        self.updateChips();
    }

    this.generateSelectsData = function(filteredVariants){
        var self = this;
        var selects = {};
        $.each( this.selectsData, function(optionName, values){
            selects[optionName] = [];
        });
        $.each( filteredVariants, function(index, variant){
            $.each( selects, function(optionName, values){
                if( values.indexOf(variant[optionName])<0 )
                    values.push(variant[optionName]);
            });
        });

        return selects;
    }

    this.getFilteredVariants = function(selectedValues){
        var filteredVariants = [];
        var self = this;

        $.each( this.variants, function(index, variant){
            var passfilter = true;
            if(variant.price > 0){
                $.each( selectedValues, function(selectName, selectValue){
                    if(selectValue != ""){
                        if(variant[selectName]){
                            if(variant[selectName] != selectValue){
                                passfilter = false;
                            }
                        }else{
                            passfilter = false;
                        }
                    }
                });
            }else{
                passfilter = false;
            }
            if(passfilter) filteredVariants.push(variant);
        });
        return filteredVariants;
    }

    this.getATag = function(selectName, optionValue){
        var self = this;
        return tag =  $('<a>', {class: ""}).text(optionValue);
    }

    this.getAColorTag = function(selectName, optionValue, color){
        var self = this;
        return tag =  $('<a>', {class: "", style:"background-color:"+color});
    }

    this.buildChips = function(variant_options){
        var self = this;
        $.each(variant_options, function(index, option){
            var selectName = option.name;
            var optionArray = option.values;
            //Color styling
            if( selectName.toLowerCase() == "color"){
                if(self.isCollection){
                    var div = $('<div>', {id: self.getVariationOptionId(selectName), name: selectName, class: "color-details-collection"}); 
                }else{
                    var div = $('<div>', {id: self.getVariationOptionId(selectName), name: selectName, class: "color-details"});
                }
     
                var ul = $('<ul>', {class: "swatches Color"});  
                var span = $('<span>', {class: "selected-color"}).append(
                                $('<strong>', {}).text(selectName.toUpperCase() + ":  ") 
                            );

            }else{//size (default) styling
                var div = $('<div>', {id: self.getVariationOptionId(selectName), name: selectName, class: "size-details"});           
                var ul = $('<ul>', {class: "swatches-size Size"});  
                var span = $('<span>', {class: "selected-size"}).append(
                                $('<strong>', {}).text(selectName.toUpperCase() + ":  ") 
                            );
            }
            
            $.each(optionArray, function(index, optionValue){
                ul.append( 
                    $('<li>', { id: self.getVariationValueId(selectName, optionValue), 
                                class: "",
                                "data-tooltip": "",
                                "data-toggle": "tooltip",
                                "title": self.outOfStock
                    })
                    .append(
                            self.getATag(selectName, optionValue)
                    ).click(function(){
                        self.updateVariants(selectName, optionValue);
                    })  
                );
            });

            var span_selected = $('<span>', {class: "", id: self.getVariationSelectedId(selectName)}).text("");

            div.append(span);
            div.append(span_selected);
            div.append(ul);

            if(self.isCollection){
                $(self.selector).append(div);
            }else{
                var row = $('<div>', {class: "row no-margin"});
                row.append(div);
                $(self.selector).append(row);
            }
        });
        
        $('[data-toggle="tooltip"]').tooltip();
        self.updateChips();
    }

    this.orderOptions = function(options){
        var ordered_options = [];
        $.each( options, function(index, option){
            var indexToInsert=0;
            for(var i=0; i<ordered_options.length; i++){
                if(ordered_options[i].position<option.position){
                    //next
                    indexToInsert = i+1;
                }else if(ordered_options[i].position>option.position){
                    break;
                }else if(ordered_options[i].position==option.position){
                    indexToInsert = i;
                    break;
                }
            }
            ordered_options.splice(indexToInsert,0,option);
        });

        return ordered_options;
    }

    this.init = function(){
        var self = this;
        //Options ordering
        self.variant_options = self.orderOptions(self.variant_options);

        //Build selectsData
        $.each( self.variant_options, function(index, option){
            self.selectsData[option.name] = [];
            $.each( option.values, function(index, value){
                self.selectsData[option.name].push(value);
            });
        });

        var selected_variant = self.variants[0];

        $.each(self.variants, function(index,variant){
            if(variant.price > 0 && variant.has_stock){
                selected_variant = variant;
                return false;
            }
        });

        //Default selected variant
        $.each(self.selectsData, function(selectName,optionArray){
            self.selectedValues[selectName] = selected_variant[selectName];
        });
        //Bluilding HTML Select elements
        self.buildChips(self.variant_options);
    }
}