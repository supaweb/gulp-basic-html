/**
 * Created by arse on 10.07.2017.
 */
'use strict';

function selectSavedItems(element){
    var selectValue = document.querySelector('select[name="' + element + '"]'),
        selected = selectValue.dataset;
    console.log(selected.items);
    if(selected.items){
        var itemsArray = selected.items.split('|');
        console.log(itemsArray);
        $.each(itemsArray, function(i, e){
            if(e){
                $('select[name="' + element + '"] option[value="' + e + '"]').prop('selected', true);
            }
        });
    }
}

$(function() {
    // высота блока с контентом Табов с прокруткой внутри этого блока
    var windowHeight = $(window).height(),
        tabPanelHeight = windowHeight - 215;
    $('.tab-content').height(tabPanelHeight).css({'overflow-y': 'auto'});

    $('.ajax').on('click', function(e){
        e.preventDefault();
        $.ajax({
            url: $(this).attr('href'),
            type: 'post',
            success: function () {
                $(this).parent('tr').hide();
                console.log($(this).parent('tr'));
            }
        });
    });

    if($('select[name="Params[cities][]"]')){
        selectSavedItems('Params[cities_array][]');
    }

});
