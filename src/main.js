const data = {
    products: [
        {name: 'Product1', count: 1, price: 100},
        {name: 'Product2', count: 2, price: 200},
        {name: 'Product2', count: 3, price: 300},
    ],
    sortBy: 'name',
    sortOrder: 'DESC',
};

const renderTableHead = () => {
    const tableHead = $('#tableHead');
    
    $(tableHead).append(
        $('<tr>'),
        $($('<th>').text('Name')),
        $($('<th>').text('Count')),
        $($('<th>').text('Price'))
    );
};

const renderTableBody = () => {
    const products = data.products;
    const tableBody = $('#tableBody');

    products.forEach((product) => (
            $(tableBody).append(
                $('<tr>'),
                $('<td>').text(product.name),
                $('<td>').text(Number(product.count)),
                $('<td>').text(Number(product.price))
            )
        )
    )
};

const render = () => {
    renderTableHead();
    renderTableBody();
};

render();