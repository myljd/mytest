/**
 * 分页对象
 */
global.Page = function(pno, pageSize, rows, data) {

    this.pno = pno;
    this.pageSize = pageSize;
    this.rows = rows;
    this.data = data;

    //首页页号
    this.f_no = 1;
    //上一页页号
    this.p_no = 1;
    if (pno - 1 > 0 ) {this.p_no = pno - 1};

    //末页页号
    if (rows % pageSize == 0 )
        {this.l_no = rows / pageSize}
    else
        {this.l_no = parseInt(rows / pageSize) + 1}

    //下一页页号
    if ((parseInt(pno) + parseInt(1)) >= this.l_no)  {
        this.n_no =  this.l_no;
    } else {
        this.n_no =  parseInt(pno) + parseInt(1);
    }

    this.pages =  this.l_no;


    return this;

}