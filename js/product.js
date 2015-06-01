$(function() {
    if(VariantsData.isCollection){
        $.each(VariantsData.products, function(product_id, variants){
            new VariantsManager(variants, variant_options, true).init();
        });
    }else{
        new VariantsManager(VariantsData.products[0], variant_options, false).init();
    }
});

function VariantsManager (variants, variant_options, isCollection) {
    var self = this;
    this.variants = variants;
    this.variant_options = variant_options;
    this.isCollection = isCollection;
    this.product_id = this.variants[0].product_id;
    this.selector = "[id=variation-selector-"+this.product_id+"]";
    this.selectsData = {};
    this.selectedValues = {};

    this.getVariationSelector = function(selectName, optionValue){
        return "[id=variation-selector-"+self.product_id+"-"+selectName+"-"+optionValue+"]";
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
                        //Selected, not available
                        // $(self.getVariationSelector(name, value)).attr("class", "notavailable-selected");
                    }else{
                        //not selected not available
                        $(self.getVariationSelector(name, value)).attr("class", "notavailable");
                        $(self.getVariationSelector(name, value)).tooltip();
                    }
                }else{
                    if(self.selectedValues[name] == value){
                        //Selected, available
                        $(self.getVariationSelector(name, value)).attr("class", "selected").tooltip("destroy");
                    }else{
                        //not Selected available
                        $(self.getVariationSelector(name, value)).attr("class", "").tooltip("destroy");
                    }
                }
            });
        });

        //hide and show variant div to display proper variant picture
        var filteredVariants = self.getFilteredVariants(self.selectedValues);

        if(filteredVariants.length == 1){
            $.each(self.variants, function(index, variant){
                var id = "product-" + variant.id;
                var quantityInput = "input[name='items["+ variant.id +"]']";
                if(variant.id == filteredVariants[0].id){
                    $("#"+id).show();
                    if(self.isCollection){
                        $(quantityInput).val(0);
                    }else{
                        $(quantityInput).val(1);
                    }
                    
                }else{
                    $(quantityInput).val(0);
                    $("#"+id).hide();
                }
            });
        }
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
            $.each(self.selectsData, function(selectName, optionArray){

                self.selectedValues[selectName] = filteredVariants[0][selectName];
            });
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

    this.buildChips = function(selectData){
        var self = this;
        $.each(selectData, function(selectName, optionArray){
            //Color styling
            if( selectName== "color"){
                if(self.isCollection){
                    var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "color-details-collection"}); 
                }else{
                    var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "color-details"});
                }
     
                var ul = $('<ul>', {class: "swatches Color"});  
                var span = $('<span>', {class: "selected-color"}).append(
                                $('<strong>', {}).text(selectName.toUpperCase()) 
                            );

            }else{//size (default) styling
                var div = $('<div>', {id: "variation-selector-"+self.product_id+"-"+selectName, name: selectName, class: "size-details"});           
                var ul = $('<ul>', {class: "swatches-size Size"});  
                var span = $('<span>', {class: "selected-size"}).append(
                                $('<strong>', {}).text(selectName.toUpperCase()) 
                            );
            }

            $.each(optionArray, function(index, optionValue){
                ul.append( 
                    $('<li>', { id: "variation-selector-"+self.product_id+"-"+selectName+"-"+optionValue, 
                                class: "",
                                "data-tooltip": "",
                                "data-toggle": "tooltip",
                                "title": "Out of stock, please try another combination"
                    })
                    .append(
                            self.getATag(selectName, optionValue)
                    ).click(function(){
                        self.updateVariants(selectName, optionValue);
                    })  
                );
            });

            div.append(span);
            div.append(ul);

            if(self.isCollection){
                $(self.selector).prepend(div);
            }else{
                var row = $('<div>', {class: "row no-margin"});
                row.append(div);
                $(self.selector).prepend(row);
            }
        });

        self.updateChips();
    }

    this.init = function(){
        var self = this;
        console.log(variant_options);
        $.each( self.variant_options, function(index, value){
            self.selectsData[value] = [];
        });

        $.each( self.variants, function(index, variant){
            $.each( self.selectsData, function(optionName, values){
                if( values.indexOf(variant[optionName])<0 )
                    values.push(variant[optionName]);
            });
        });

        //Default selected variant
        $.each(self.selectsData, function(selectName,optionArray){
            self.selectedValues[selectName] = self.variants[0][selectName];
        });
        //Bluilding HTML Select elements
        self.buildChips(self.selectsData);
    }
}