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

const initEvents = () => {
    $('#searchInput').unbind().on('keypress', key => key.which === 13 ? searchHandler() : null);
    $('#searchButton').unbind().click(searchHandler);
    $('#addNewButton').unbind().click({ 'product': defaultProduct }, renderEditModal);
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

const searchHandler = () => {
    const searchString = $('#searchInput').val();
    data.search = searchString.trim().toLowerCase();
    renderTableBody();
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
    } else {
        product = event.data.product;
    }

    product.name = $('#productName').val();
    product.email = $('#supplierEmail').val();
    product.count = $('#productCount').val();
    product.price = $('#productPrice').val();

    data.products.push(product);
    $('#modalEdit, #modalFade').hide();
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
    $('#modalDelete, #modalFade').hide();
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
    $('#nameHandler').click({ 'column': 'name' }, sortHandler);
    $('#priceHandler').click({ 'column': 'price' }, sortHandler);
};

const renderTableBody = () => {
    const { products, sortBy, sortOrder, search } = data;
    const sortedProducts = _.orderBy(products, sortBy, sortOrder);
    const searchedProducts = sortedProducts.filter((product) => product.name.trim().toLowerCase().includes(search));

    const tmpl = _.template($('#tableBodyTemplate').html());

    $('#tableBody').html(tmpl({
        products: searchedProducts
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

const hideCountyCheckBoxGroups = (product) => {
    for (country in product.delivery){
        $('#' + country + 'CheckBoxGroup').hide();
    }
};

const renderEditModal = (event) => {
    const { product } = event.data;

    const tmpl = _.template($('#modalEditTemplate').html());

    $('#modalEdit').html(tmpl({
        product
    }));
    hideCountyCheckBoxGroups(product);
    $('#countrySelect').change(() => {
        hideCountyCheckBoxGroups(product);
        $('#' + $('#countrySelect').children(":selected").val() + 'CheckBoxGroup').show();
    });
    $("#acceptEdit").click({ product }, editProduct);
    $('#rejectEdit').click(closeModals);
    $('#modalEdit, #modalFade').show();
};

$(document).ready(() =>{
    initEvents();
    loadProducts();
});
