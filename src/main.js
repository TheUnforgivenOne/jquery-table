const data = {
    products: [],
    sortBy: 'name',
    sortOrder: 'asc',
};

const loadProducts = () => {
    const url = './products.json';

    $.ajax({
        type: 'GET',
        url: url,
        success: (resp) => {
            data.products = resp;
            render();
        }
    });
};

const editProduct = (event) => {
    const { product } = event.data;

    product.name = $('#productName').val();
    product.email = $('#supplierEmail').val();
    product.count = $('#productCount').val();
    product.price = $('#productPrice').val();

    $('#modalEdit, #modalFade').hide();
    renderTableBody();
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
    if (data.sortBy === event.data.column) {
        toggleSortOrder();
    } else {
        data.sortOrder = 'asc';
        toggleSortBy();
    }
    render();
};

const renderTableHead = () => {
    const tableHead = $('#tableHead');

    $(tableHead).empty();
    $(tableHead).append(
        $('<tr>').append(
            $('<th>').append(
                $('<a>')
                    .text('Name')
                    .attr({ 'href': '#' })
                    .click({ 'column': 'name' }, sortHandler)
            ),
            $('<th>').append(
                $('<a>')
                    .text('Price')
                    .attr({ 'href': '#' })
                    .click({ 'column': 'price' }, sortHandler)
            ),
            $('<th>').text('Actions')
        )
    )
};

const renderTableBody = () => {
    const tableBody = $('#tableBody');
    const { products, sortBy, sortOrder } = data;
    const sortedProducts = _.orderBy(products, sortBy, sortOrder);

    $(tableBody).empty();
    sortedProducts.forEach((product) => {
        $(tableBody).append(
            $('<tr>'),
            $('<td>').append(
                $('<div>')
                    .attr({ 'class': 'd-flex justify-content-between' })
                    .append(
                        $('<a>')
                            .text(product.name)
                            .attr({ 'href': '#' })
                            .click({ 'product': product }, renderEditModal),
                        $('<span>')
                            .text(product.count)
                            .attr({})
                    )
            ),
            $('<td>').text(Number(product.price)),
            $('<td>')
                .attr({ 'class': 'd-flex justify-content-around' })
                .append(
                    $('<button>')
                        .text('Edit')
                        .attr({ 'class': 'btn btn-outline-secondary' })
                        .click({ 'product': product }, renderEditModal),
                    $('<button>')
                        .text('Delete')
                        .attr({ 'class': 'btn btn-outline-secondary' })
                        .click({ 'product': product }, renderDeleteModal)
                )
            )
        }
    )
};

const renderCities = (event) => {
    const { product } = event.data;
    const selectedCountry = $('#country').val();
    const cities = product.delivery[selectedCountry];

    $('#cities').empty().append(
        $('<div>').append(
            $('<input>')
                .attr({ 'type': 'checkbox', 'id': 'selectAll', 'class': 'm-1' }),
            $('<label>')
                .text('Select all')
                .attr({ 'for': 'selectAll', 'class': 'm-1' })
        )
    );
    for (city in cities) {
        $('#cities').append(
            $('<div>').append(
                $('<input>')
                    .attr({ 'type': 'checkbox', 'id': city, 'checked': cities[city], 'class': 'm-1' }),
                $('<label>')
                    .text(city)
                    .attr({ 'for': city, 'class': 'm-1' })
            )
        )
    }

};

const renderEditModal = (event) => {
    const { product } = event.data;

    $('#modalEditHeader').text(product.name);
    $('#productName').val(product.name);
    $('#supplierEmail').val(product.email);
    $('#productCount').val(product.count);
    $('#productPrice').val(product.price);
    $('#country').empty().append(
        $('<option>')
            .text('Belarus')
            .attr({ 'value': 'belarus' }),
        $('<option>')
            .text('Russia')
            .attr({ 'value': 'russia', 'selected': 'selected' }),
        $('<option>')
            .text('USA')
            .attr({ 'value': 'usa' }),
    ).on('change', { 'product': product }, renderCities);
    renderCities( { data: { 'product': product } }, $('#country').val());
    $("#acceptEdit").unbind().click({ 'product': product }, editProduct);
    $('#rejectEdit').unbind().click(() => {
        $('#modalEdit, #modalFade').hide();
    });
    $('#modalEdit, #modalFade').show();
};

const renderDeleteModal = (event) => {
    const { product } = event.data;

    $('#modalDeleteBody').text('Are you sure you want to delete ' + product.name + '?');
    $('#modalDelete, #modalFade').show();
    $('#acceptDeletionButton').unbind().click({'productId': product.id}, deleteProduct);
    $('#rejectDeletionButton').unbind().click(() => {
        $('#modalDelete, #modalFade').hide();
    });
};

const render = () => {
    renderTableHead();
    renderTableBody();
};

loadProducts();