var dataDetail = [];
var dataHeader;
var ApiLocal = "http://localhost:5022/";
var js = jQuery.noConflict(true);
var tables;
var isAdm;
var customers = [];

js(document).ready(function () {
    if (customers.length <=0) {
        GetAllDataCustomer();
    }

    isAdm = document.getElementById("isAdmin").value;
    if (isAdm == 'false') {
        $('#btnAdd').hide();
    }
    getHeaderData();

    js("#btnSearch").on('click', function () {
        // Your code here
        var inpId = document.getElementById("txtOrderID").value == "" ? "" : document.getElementById("txtOrderID").value;
        var inpCust = document.getElementById("ddlCustomer").value == "" ? "" : document.getElementById("ddlCustomer").value;

        js.ajax({
            url: ApiLocal + 'GetDataHeaderFiltered?orderID=' + inpId +'&custName='+ inpCust,
            type: 'GET',
            contentType: 'application/json',
            success: function (result) {
                var res = json2array(result);
                dataTables(res);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

});

function GetAllDataCustomer() {
    js.ajax({
        url: ApiLocal + 'GetAllDataCustomer',
        type: 'GET',
        contentType: 'application/json',
        success: function (result) {
            var res = json2array(result);
            console.log(customers);
            var customerNames = res.map(function (customer) {
                return customer.customerName;
            });
            customers = customerNames;

            var ddlCustomer = document.getElementById("ddlCustomer");

            customerNames.forEach(function (customerName) {
                var option = document.createElement("option");
                option.value = customerName;
                option.text = customerName;
                ddlCustomer.add(option);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getHeaderData() {
    js.ajax({
        url: ApiLocal + 'GetAllDataHeader',
        type: 'GET',
        contentType: 'application/json',
        success: function (result) {
            dataSource = json2array(result);
            dataHeader = dataSource;
            dataTables(dataSource);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function dataTables(dataSource) {
    tables = js("#tblOrder").DataTable({
        data: dataSource,
        destroy: true,
        bFilter: true,
        lengthMenu: [5, 10, 25, 50],
        pageLength: 5,
        processing: false,
        columns: [
            { data: 'orderID', targets: 0, searchable: true },
            { data: 'orderDate', targets: 1, searchable: true },
            { data: 'customerName', targets: 2, searchable: true },
            { data: 'shipName', targets: 3, searchable: false },
            { data: 'totalPrice', targets: 4, searchable: false },
            {
                data: null,
                render: function (data, type, row, meta) {
                    if (isAdm == 'true') {
                        return '<a onclick="btnModify(\'' + data.orderID + '\')" class="btn btn-primary">modify</a> &nbsp; <a onclick = "btnDel(\'' + data.orderID + '\')" class="btn btn-danger" > delete</a > ';
                    } else {
                        return '<a onclick="btnModify(\'' + data.orderID + '\')" class="btn btn-primary">modify</a>';
                    }
                    
                }
            },
        ],
        columnDefs: [
            { "orderable": false, "targets": 'no-sort' }
        ]

    });
}

function btnModify(orderID) {
    if (orderID != null) {

        getDataDetail(orderID);
    }
    var data = dataHeader.filter(x => x["orderID"] == orderID)[0];
    $("#txtOrderID").val(orderID);
    $("#txtCustomerID").val(data.customerID);
    $("#txtOrderDate").val(data.orderDate.split('T')[0]);
    $("#txtCompanyName").val(data.customerName);
    $("#txtRequiredDate").val(data.requiredDate.split('T')[0]);
    $("#txtShipName").val(data.shipName);
    $("#txtCity").val(data.city);
    $("#txtAddress").val(data.address);
    $("#totalPrice").val(data.totalPrice);
    $('#detailsorder').modal('show');
}

function getDataDetail(orderID) {
    js.ajax({
        url: ApiLocal + 'GetDataODByOrderID?orderID='+orderID,
        type: 'GET',
        contentType: 'application/json',
        success: function (result) {
            dataDetail = json2array(result);
            dataTableDetails(dataDetail);
            console.log(dataDetail);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function dataTableDetails(dataDetail) {
    tables = js("#tblDetailOrder").DataTable({
        data: dataDetail,
        destroy: true,
        bFilter: true,
        lengthMenu: [5, 10, 25, 50],
        pageLength: 5,
        processing: false,
        columns: [
            { data: 'productId', targets: 0, searchable: true },
            { data: 'productName', targets: 1, searchable: true },
            { data: 'price', targets: 2, searchable: true },
            { data: 'qty', targets: 3, searchable: false },
            { data: 'subTotal', targets: 4, searchable: false }
        ],
        columnDefs: [
            { "orderable": false, "targets": 'no-sort' }
        ]

    });
}
function btnDel(id) {
    Swal.fire({
        title: 'Do you want to delete this data?',
        showCancelButton: true,
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: ApiLocal + "DeleteOrder/"+id,
                success: function (response) {
                    Swal.fire("Delete Success!", "", "success");
                    getHeaderData();
                },
                error: function (e) {
                    console.log(e);
                }
            });           
        }
    });
}

function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}

