const data = {
    products: [],
    sortBy: 'name',
    sortOrder: 'asc',
    search: ''
};

const defaultProduct = {
    "id": null,
    "name": "New Product",
    "email": null,
    "count": null,
    "price": null,
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
            "New York": false,
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

const validateProduct = (product) => {
    let valid = [];
    valid.push(/^([a-zA-Z\s]){5,15}$/.test(product.name));
    valid.push(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(product.email.toLowerCase()));
    valid.push(product.count > 0);
    valid.push(product.price > 0);

    valid[0] === false ?
        $('#productName').addClass('invalid') :
        $('#productName').removeClass('invalid');
    valid[1] === false ?
        $('#supplierEmail').addClass('invalid') :
        $('#supplierEmail').removeClass('invalid');
    !valid[2] ?
        $('#productCount').addClass('invalid') :
        $('#productCount').removeClass('invalid');
    !valid[3] ?
        $('#productPrice').addClass('invalid') :
        $('#productPrice').removeClass('invalid');
    return valid.every((e) => e === true);
};

const editProduct = (event) => {
    let product;
    if (event.data.product.id == null) {
        product = _.clone(defaultProduct);
        product.id = uniqueId();
        product.name = $('#productName').val();
        product.email = $('#supplierEmail').val();
        product.count = $('#productCount').val();
        product.price = $('#productPrice').val();
        data.products.push(product);
    } else {
        product = event.data.product;
        product.name = $('#product' + product.id + 'Name').val();
        product.email = $('#supplierEmail' + product.id).val();
        product.count = $('#product' + product.id + 'Count').val();
        product.price = $('#product' + product.id + 'Price').val();
    }

    for (country in product.delivery){
        for (city in product.delivery[country]){
            product.delivery[country][city] = $('#' + city + 'CheckBox').is(':checked');
        }
    }

    closeModals();
    renderTableBody();
    // if (validateProduct(product)){
    //     data.products.push(product);
    //     $('#modalEdit, #modalFade').hide();
    //     renderTableBody();
    // } else {
    //     alert('You have incorrect fields');
    // }
};

const deleteProduct = (event) => {
    const { productId } = event.data;

    data.products.splice(data.products.findIndex(p => p.id === productId), 1);

    closeModals();
    renderTableBody();
};

const searchHandler = () => {
    const searchString = $('#searchInput').val();
    data.search = searchString.trim().toLowerCase();
    renderTableBody();
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
        $('#product' + product.id + 'EditLink').click({ product }, renderEditModal);
        $('#product' + product.id + 'EditButton').click({ product }, renderEditModal);
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
    const { product } = event.data;

    const tmpl = _.template($('#modalEditTemplate').html());

    $('#modalEdit').html(tmpl({
        product
    }));
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
    $("#acceptEdit").click({ product }, editProduct);
    $('#rejectEdit').click(closeModals);
    $('#modalEdit, #modalFade').show();
};

$(document).ready(() =>{
    initDefaultEvents();
    loadProducts();
});
