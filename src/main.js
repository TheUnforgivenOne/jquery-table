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
        async: false,
        success: (resp) => {
            data.products = resp;
            render();
        }
    });
};

const editHandler = () => {

};

const deleteHandler = () => {

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
                    .attr({'href': '#'})
                    .click({column: 'name'}, sortHandler)
            ),
            $('<th>').append(
                $('<a>')
                    .text('Price')
                    .attr({'href': '#'})
                    .click({column: 'price'}, sortHandler)
            ),
            $('<th>').text('Actions')
        )
    )
};

const renderTableBody = () => {
    const tableBody = $('#tableBody');
    const {products, sortBy, sortOrder} = data;
    const sortedProducts = _.orderBy(products, sortBy, sortOrder);

    $(tableBody).empty();
    sortedProducts.forEach((product) => {
            $(tableBody).append(
                $('<tr>'),
                $('<td>').append(
                    $('<a>')
                        .text(product.name)
                        .attr({'href': '#'})
                ),
                $('<td>').text(Number(product.price)),
                $('<td>').attr({'class': 'd-flex justify-content-around'}).append(
                        $('<button>')
                            .text('Edit')
                            .attr({'class': 'btn btn-outline-secondary'})
                            .click(editHandler),
                        $('<button>')
                            .text('Delete')
                            .attr({'class': 'btn btn-outline-secondary'})
                            .click(deleteHandler)
                )
            )
        }
    )
};

const render = () => {
    renderTableHead();
    renderTableBody();
};

loadProducts();
// render();