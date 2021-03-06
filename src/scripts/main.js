const data = {
    products: [],
    sortBy: 'name',
    sortOrder: 'asc',
    search: ''
};

const defaultProduct = {
    "id": '',
    "name": "New Product",
    "email": '',
    "count": '',
    "price": '',
    "delivery": {
        "belarus": {
            "Borisov": false,
            "Brest": false,
            "Minsk": false
        },
        "russia": {
            "Bryansk": false,
            "Moskow": false,
            "Saratov": false
        },
        "usa": {
            "New-York": false,
            "Los-Angeles": false,
            "Washington": false
        }
    }
};

const initDefaultEvents = () => {
    $('#searchInput').keypress((event) => event.keyCode === 13 ? searchHandler() : null);
    $('#searchButton').click(searchHandler);
    $('#addNewButton').click({ 'product': defaultProduct }, renderEditModal);
};

const loadProducts = () => {
    const url = './products.json';

    $.ajax({
        type: 'GET',
        url: url,
        success: (resp) => {
            data.products = resp;
            renderTable();
        }
    });
};

const closeModals = () => {
    $('#modalDelete, #modalEdit, #modalFade').hide();
};

const uniqueId = () => {
    const { products } = data;
    let id = 1;
    let idList = [];

    for (product of products) {
        idList.push(product.id);
    }
    while (idList.indexOf(id) !== -1) {
        id++;
    }

    return id;
};

const allFieldsCorrect = (product) => {
    $('#product' + product.id + 'Name').removeClass('invalid');
    $('#supplierEmail' + product.id).removeClass('invalid');
    $('#product' + product.id + 'Count').removeClass('invalid');
    $('#product' + product.id + 'Price').removeClass('invalid');
};

const validateProduct = (product) => {
    let incorrectFields = [];
    /^([a-zA-Z\s]){5,15}$/.test(product.name) === false ? incorrectFields.push('#product' + product.id + 'Name') : null;
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(product.email) === false ? incorrectFields.push('#supplierEmail' + product.id) : null;
    (product.count === '') || (Number(product.count) < 0) || (!Number.isInteger(Number(product.count))) ? incorrectFields.push('#product' + product.id + 'Count') : null;
    (product.price === '') || (Number(product.price) < 0) ? incorrectFields.push('#product' + product.id + 'Price') : null;

    return incorrectFields;
};

const editProduct = (event) => {
    const { readOnly } = event.data;
    let product;
    if (event.data.product.id === '') {
        product = _.clone(defaultProduct);
    } else {
        product = event.data.product;
    }

    if (!readOnly) {
        product.name = $('#product' + product.id + 'Name').val();
        product.email = $('#supplierEmail' + product.id).val();
        product.count = $('#product' + product.id + 'Count').val();
        product.price = $('#product' + product.id + 'Price').val().replace(/[^\d\.]/g, "");

        allFieldsCorrect(product);
        incorrectFields = validateProduct(product);
        for (fieldId of incorrectFields) {
            $(fieldId).addClass('invalid');
        }

        for (country in product.delivery) {
            for (city in product.delivery[country]) {
                product.delivery[country][city] = $('#' + city + 'CheckBox').is(':checked');
            }
        }

        if (incorrectFields.length === 0) {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (event.data.product.id === '') {
                        product.id = uniqueId();
                        data.products.push(product);
                    }
                    closeModals();
                    renderTableBody();
                    resolve();
                }, 2000);
            });
        } else {
            $(incorrectFields[0]).focus();
        }
    } else {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                closeModals();
                renderTableBody();
                resolve();
            }, 2000);
        });
    }
};

const deleteProduct = (event) => {
    const { productId } = event.data;

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            data.products.splice(data.products.findIndex(p => p.id === productId), 1);
            resolve();
        }, 2000);
    });

    promise.then(() => {
        closeModals();
        renderTableBody();
    });
};

const searchHandler = () => {
    const searchString = $('#searchInput').val();

    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            data.search = searchString.trim().toLowerCase();
            resolve();
        }, 2000);
    });

    promise.then(() => {
        renderTableBody();
    });
};

const toggleSortBy = () => {
    data.sortBy = data.sortBy === 'name' ? 'price' : 'name';
};

const toggleSortOrder = () => {
    data.sortOrder = data.sortOrder === 'desc' ? 'asc' : 'desc';
};

const sortHandler = (event) => {
    const { column } = event.data;
    const { sortBy } = data;

    if (sortBy === column) {
        toggleSortOrder();
    } else {
        data.sortOrder = 'asc';
        toggleSortBy();
    }
    renderTable();
};

const renderTableHead = () => {
    const { sortBy, sortOrder } = data;
    const arrow = sortOrder === 'asc' ? '&#9660;' : '&#9650;';

    const tmpl = _.template($('#tableHeadTemplate').html());

    $('#tableHead').html(tmpl({
        sortBy,
        arrow
    }));
    $('#nameColumn').click({ 'column': 'name' }, sortHandler);
    $('#priceColumn').click({ 'column': 'price' }, sortHandler);
};

const renderTableBody = () => {
    const { products, sortBy, sortOrder, search } = data;
    let searchedProducts;
    if (search !== ''){
        searchedProducts = products.filter((product) => product.name.trim().toLowerCase().includes(search));
    } else {
        searchedProducts = products;
    }
    const sortedProducts = _.orderBy(searchedProducts, sortBy, sortOrder);

    const tmpl = _.template($('#tableBodyTemplate').html());

    $('#tableBody').html(tmpl({
        products: sortedProducts
    }));
    products.forEach((product) => {
        $('#product' + product.id + 'EditLink').click({ product, readOnly: true }, renderEditModal);
        $('#product' + product.id + 'EditButton').click({ product, readOnly: false }, renderEditModal);
        $('#product' + product.id + 'DeleteButton').click({ product }, renderDeleteModal);
    });
};

const renderTable = () => {
    renderTableHead();
    renderTableBody();
};

const renderDeleteModal = (event) => {
    const { product } = event.data;

    const tmpl = _.template($('#modalDeleteTemplate').html());

    $('#modalDelete').html(tmpl({
        product
    }));
    $('#acceptDeletionButton').click({ 'productId': product.id }, deleteProduct);
    $('#rejectDeletionButton').click(closeModals);
    $('#modalDelete, #modalFade').show();
};

const hideCountryCheckBoxGroups = (product) => {
    for (country in product.delivery){
        $('#' + country).hide();
    }
};

const renderEditModal = (event) => {
    const { product, readOnly } = event.data;

    const tmpl = _.template($('#modalEditTemplate').html());

    $('#modalEdit').html(tmpl({
        product
    }));
    $('#product' + product.id + 'Price')
        .focusin(() => {
            const productPriceId = '#product' + product.id + 'Price';
            $(productPriceId).val($(productPriceId).val().replace(/[^\d\.]/g, ""));
        })
        .focusout(() => {
            const productPriceId = '#product' + product.id + 'Price';
            if ($(productPriceId).val() !== '') {
                $(productPriceId).val('$' + parseFloat($(productPriceId).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
            }
        });
    hideCountryCheckBoxGroups(product);
    for (country in product.delivery){
        for (city in product.delivery[country]){
            $('#' + city + 'CheckBox').prop('checked', product.delivery[country][city]);
        }
    }
    $('#countrySelect').change(() => {
        hideCountryCheckBoxGroups(product);
        if ($('#countrySelect').children(":selected").val()) {
            const selectedCountry = $('#countrySelect').children(":selected").val();
            $('#' + selectedCountry).show();
            $('#' + selectedCountry + 'SelectAllCities').change({product, selectedCountry}, (event) => {
                const {product, selectedCountry} = event.data;
                for (city in product.delivery[selectedCountry]) {
                    $('#' + city + 'CheckBox').prop('checked', true);
                }
            });
        }
    });

    if (readOnly){
        $('#modalEditFooter').text('Read only. Changes will not be saved.')
    }

    $("#acceptEdit").click({ product, readOnly }, editProduct);
    $('#rejectEdit').click(closeModals);
    $('#modalEdit, #modalFade').show();
    $(window).scrollTop(0);
};

$(document).ready(() =>{
    initDefaultEvents();
    loadProducts();
});
