const data = {
    products: [
        {name: 'Product1', count: 1, price: 100},
        {name: 'Product2', count: 2, price: 200},
        {name: 'Product2', count: 3, price: 300},
    ],
    sortBy: 'name',
    sortOrder: 'DESC',
};

const editHandler = () => {

};

const deleteHandler = () => {

};

const renderTableHead = () => {
    const tableHead = $('#tableHead');

    $(tableHead).append(
        $('<tr>'),
        $('<th>').text('Name'),
        $('<th>').text('Price'),
        $('<th>').text('Actions')
    );
};

const renderTableBody = () => {
    const products = data.products;
    const tableBody = $('#tableBody');

    products.forEach((product) => (
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