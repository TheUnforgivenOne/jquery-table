const data = {
    products: [
        {name: 'Product1', count: 1, price: 100},
        {name: 'Product2', count: 18, price: 1200},
        {name: 'Product3', count: 5, price: 300},
    ],
    sortBy: 'name',
    sortOrder: 'asc',
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
            priceCol = $('<th>').append(
                $('<a>')
                    .text('Price')
                    .attr({'href': '#'})
                    .click({column: 'price'}, sortHandler)
            ),
            actionsCol = $('<th>').text('Actions')
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

render();