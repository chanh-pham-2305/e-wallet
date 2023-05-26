class AdminController {
    index(req, res) {
      res.render("admin/index");
    }

    active(req, res) {
      res.render("admin/table-data-active");
    }

    history(req, res) {
      res.render("admin/table-data-history");
    }

    disable(req, res) {
      res.render("admin/table-data-disable");
    }

    lock(req, res) {
        res.render("admin/table-data-lock");
      }

    nonactive(req, res) {
        res.render("admin/table-data-non-active");
      }

    submit(req, res) {
        res.render("admin/table-data-submit");
      }

    add(req, res) {
        res.render("admin/form-add-tai-khoan");
      }
  }

  module.exports = new AdminController();