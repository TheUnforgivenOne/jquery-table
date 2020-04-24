const data = {
    products: [
        {name: 'Product1', count: 1, price: 100},
        {name: 'Product2', count: 18, price: 1200},
        {name: 'Product3', count: 5, price: 300},
    ],
    sortBy: 'name',
    sortOrder: 'desc',
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

    const nameCol = $('<th>').append(
        $('<a>')
            .attr('href', '#')
            .text('Name')
            .click({column: 'name'}, sortHandler)
    );
    const priceCol = $('<th>').append(
        $('<a>')
            .attr('href', '#')
            .text('Price')
            .click({column: 'price'}, sortHandler)
    );
    const actionsCol = $('<th>').text('Actions');

    $(tableHead).empty();
    $(tableHead).append(
        $('<tr>'),
        $(nameCol),
        $(priceCol),
        $(actionsCol)
    );
};

const renderTableBody = () => {
    const tableBody = $('#tableBody');
    const {products, sortBy, sortOrder} = data;
    const sortedProducts = _.orderBy(products, sortBy, sortOrder);

    $(tableBody).empty();
    sortedProducts.forEach((product) => (
            $(tableBody).append(
                $('<tr>'),
                $('<td>').text(product.name),
                $('<td>').text(Number(product.price)),
                $('<td>').append(
                    $('<button>').text('Edit').click(editHandler)
                ),
                $('<td>').append(
                    $('<button>').text('Delete').click(deleteHandler))
                )
            )
    )
};

const render = () => {
    renderTableHead();
    renderTableBody();
};

render();