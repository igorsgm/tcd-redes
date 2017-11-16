/*!
 * FormValidation (http://formvalidation.io)
 * The best jQuery plugin to validate form fields. Support Bootstrap, Foundation, Pure, SemanticUI, UIKit and custom frameworks
 * 
 * This is a custom build that does NOT consist of all validators. Only popular validators are included:
 * - between
 * - callback
 * - choice
 * - color
 * - creditCard
 * - date
 * - different
 * - digits
 * - emailAddress
 * - file
 * - greaterThan
 * - identical
 * - integer
 * - lessThan
 * - notEmpty
 * - numeric
 * - promise
 * - regexp
 * - remote
 * - stringLength
 * - uri
 *
 * Use formValidation(.min).js file if you want to have all validators.
 *
 * @version     v0.8.1, built on 2016-07-29 12:06:51 AM
 * @author      https://twitter.com/formvalidation
 * @copyright   (c) 2013 - 2016 Nguyen Huu Phuoc
 * @license     http://formvalidation.io/license/
 */
if (window.FormValidation = {
        AddOn: {},
        Framework: {},
        I18n: {},
        Validator: {}
    }, "undefined" == typeof jQuery) throw new Error("FormValidation requires jQuery");
! function(a) {
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (+b[0] < 2 && +b[1] < 9 || 1 === +b[0] && 9 === +b[1] && +b[2] < 1) throw new Error("FormValidation requires jQuery version 1.9.1 or higher")
}(jQuery),
function(a) {
    FormValidation.Base = function(b, c, d) {
        this.$form = a(b), this.options = a.extend({}, a.fn.formValidation.DEFAULT_OPTIONS, c), this._namespace = d || "fv", this.$invalidFields = a([]), this.$submitButton = null, this.$hiddenButton = null, this.STATUS_NOT_VALIDATED = "NOT_VALIDATED", this.STATUS_VALIDATING = "VALIDATING", this.STATUS_INVALID = "INVALID", this.STATUS_VALID = "VALID", this.STATUS_IGNORED = "IGNORED", this.DEFAULT_MESSAGE = a.fn.formValidation.DEFAULT_MESSAGE, this._ieVersion = function() {
            for (var a = 3, b = document.createElement("div"), c = b.all || []; b.innerHTML = "<!--[if gt IE " + ++a + "]><br><![endif]-->", c[0];);
            return a > 4 ? a : document.documentMode
        }();
        var e = document.createElement("div");
        this._changeEvent = 9 !== this._ieVersion && "oninput" in e ? "input" : "keyup", this._submitIfValid = null, this._cacheFields = {}, this._init()
    }, FormValidation.Base.prototype = {
        constructor: FormValidation.Base,
        _exceedThreshold: function(b) {
            var c = this._namespace,
                d = b.attr("data-" + c + "-field"),
                e = this.options.fields[d].threshold || this.options.threshold;
            if (!e) return !0;
            var f = -1 !== a.inArray(b.attr("type"), ["button", "checkbox", "file", "hidden", "image", "radio", "reset", "submit"]);
            return f || b.val().length >= e
        },
        _init: function() {
            var b = this,
                c = this._namespace,
                d = {
                    addOns: {},
                    autoFocus: this.$form.attr("data-" + c + "-autofocus"),
                    button: {
                        selector: this.$form.attr("data-" + c + "-button-selector") || this.$form.attr("data-" + c + "-submitbuttons"),
                        disabled: this.$form.attr("data-" + c + "-button-disabled")
                    },
                    control: {
                        valid: this.$form.attr("data-" + c + "-control-valid"),
                        invalid: this.$form.attr("data-" + c + "-control-invalid")
                    },
                    err: {
                        clazz: this.$form.attr("data-" + c + "-err-clazz"),
                        container: this.$form.attr("data-" + c + "-err-container") || this.$form.attr("data-" + c + "-container"),
                        parent: this.$form.attr("data-" + c + "-err-parent")
                    },
                    events: {
                        formInit: this.$form.attr("data-" + c + "-events-form-init"),
                        formPreValidate: this.$form.attr("data-" + c + "-events-form-prevalidate"),
                        formError: this.$form.attr("data-" + c + "-events-form-error"),
                        formReset: this.$form.attr("data-" + c + "-events-form-reset"),
                        formSuccess: this.$form.attr("data-" + c + "-events-form-success"),
                        fieldAdded: this.$form.attr("data-" + c + "-events-field-added"),
                        fieldRemoved: this.$form.attr("data-" + c + "-events-field-removed"),
                        fieldInit: this.$form.attr("data-" + c + "-events-field-init"),
                        fieldError: this.$form.attr("data-" + c + "-events-field-error"),
                        fieldReset: this.$form.attr("data-" + c + "-events-field-reset"),
                        fieldSuccess: this.$form.attr("data-" + c + "-events-field-success"),
                        fieldStatus: this.$form.attr("data-" + c + "-events-field-status"),
                        localeChanged: this.$form.attr("data-" + c + "-events-locale-changed"),
                        validatorError: this.$form.attr("data-" + c + "-events-validator-error"),
                        validatorSuccess: this.$form.attr("data-" + c + "-events-validator-success"),
                        validatorIgnored: this.$form.attr("data-" + c + "-events-validator-ignored")
                    },
                    excluded: this.$form.attr("data-" + c + "-excluded"),
                    icon: {
                        valid: this.$form.attr("data-" + c + "-icon-valid") || this.$form.attr("data-" + c + "-feedbackicons-valid"),
                        invalid: this.$form.attr("data-" + c + "-icon-invalid") || this.$form.attr("data-" + c + "-feedbackicons-invalid"),
                        validating: this.$form.attr("data-" + c + "-icon-validating") || this.$form.attr("data-" + c + "-feedbackicons-validating"),
                        feedback: this.$form.attr("data-" + c + "-icon-feedback")
                    },
                    live: this.$form.attr("data-" + c + "-live"),
                    locale: this.$form.attr("data-" + c + "-locale"),
                    message: this.$form.attr("data-" + c + "-message"),
                    onPreValidate: this.$form.attr("data-" + c + "-onprevalidate"),
                    onError: this.$form.attr("data-" + c + "-onerror"),
                    onReset: this.$form.attr("data-" + c + "-onreset"),
                    onSuccess: this.$form.attr("data-" + c + "-onsuccess"),
                    row: {
                        selector: this.$form.attr("data-" + c + "-row-selector") || this.$form.attr("data-" + c + "-group"),
                        valid: this.$form.attr("data-" + c + "-row-valid"),
                        invalid: this.$form.attr("data-" + c + "-row-invalid"),
                        feedback: this.$form.attr("data-" + c + "-row-feedback")
                    },
                    threshold: this.$form.attr("data-" + c + "-threshold"),
                    trigger: this.$form.attr("data-" + c + "-trigger"),
                    verbose: this.$form.attr("data-" + c + "-verbose"),
                    fields: {}
                };
            this.$form.attr("novalidate", "novalidate").addClass(this.options.elementClass).on("submit." + c, function(a) {
                a.preventDefault(), b.validate()
            }).on("click." + c, this.options.button.selector, function() {
                b.$submitButton = a(this), b._submitIfValid = !0
            }), (this.options.declarative === !0 || "true" === this.options.declarative) && this.$form.find("[name], [data-" + c + "-field]").each(function() {
                var e = a(this),
                    f = e.attr("name") || e.attr("data-" + c + "-field"),
                    g = b._parseOptions(e);
                g && (e.attr("data-" + c + "-field", f), d.fields[f] = a.extend({}, g, d.fields[f]))
            }), this.options = a.extend(!0, this.options, d), "string" == typeof this.options.err.parent && (this.options.err.parent = new RegExp(this.options.err.parent)), this.options.container && (this.options.err.container = this.options.container, delete this.options.container), this.options.feedbackIcons && (this.options.icon = a.extend(!0, this.options.icon, this.options.feedbackIcons), delete this.options.feedbackIcons), this.options.group && (this.options.row.selector = this.options.group, delete this.options.group), this.options.submitButtons && (this.options.button.selector = this.options.submitButtons, delete this.options.submitButtons), FormValidation.I18n[this.options.locale] || (this.options.locale = a.fn.formValidation.DEFAULT_OPTIONS.locale), (this.options.declarative === !0 || "true" === this.options.declarative) && (this.options = a.extend(!0, this.options, {
                addOns: this._parseAddOnOptions()
            })), this.$hiddenButton = a("<button/>").attr("type", "submit").prependTo(this.$form).addClass("fv-hidden-submit").css({
                display: "none",
                width: 0,
                height: 0
            }), this.$form.on("click." + this._namespace, '[type="submit"]', function(c) {
                if (!c.isDefaultPrevented()) {
                    var d = a(c.target),
                        e = d.is('[type="submit"]') ? d.eq(0) : d.parent('[type="submit"]').eq(0);
                    if (b.options.button.selector && !e.is(b.options.button.selector) && !e.is(b.$hiddenButton)) return b.$form.off("submit." + b._namespace).submit(), !1
                }
            });
            for (var e in this.options.fields) this._initField(e);
            for (var f in this.options.addOns) "function" == typeof FormValidation.AddOn[f].init && FormValidation.AddOn[f].init(this, this.options.addOns[f]);
            this.$form.trigger(a.Event(this.options.events.formInit), {
                bv: this,
                fv: this,
                options: this.options
            }), this.options.onPreValidate && this.$form.on(this.options.events.formPreValidate, function(a) {
                FormValidation.Helper.call(b.options.onPreValidate, [a])
            }), this.options.onSuccess && this.$form.on(this.options.events.formSuccess, function(a) {
                FormValidation.Helper.call(b.options.onSuccess, [a])
            }), this.options.onError && this.$form.on(this.options.events.formError, function(a) {
                FormValidation.Helper.call(b.options.onError, [a])
            }), this.options.onReset && this.$form.on(this.options.events.formReset, function(a) {
                FormValidation.Helper.call(b.options.onReset, [a])
            })
        },
        _initField: function(b) {
            var c = this._namespace,
                d = a([]);
            switch (typeof b) {
                case "object":
                    d = b, b = b.attr("data-" + c + "-field");
                    break;
                case "string":
                    d = this.getFieldElements(b), d.attr("data-" + c + "-field", b)
            }
            if (0 !== d.length && null !== this.options.fields[b] && null !== this.options.fields[b].validators) {
                var e, f, g = this.options.fields[b].validators;
                for (e in g) f = g[e].alias || e, FormValidation.Validator[f] || delete this.options.fields[b].validators[e];
                null === this.options.fields[b].enabled && (this.options.fields[b].enabled = !0);
                for (var h = this, i = d.length, j = d.attr("type"), k = 1 === i || "radio" === j || "checkbox" === j, l = this._getFieldTrigger(d.eq(0)), m = this.options.err.clazz.split(" ").join("."), n = a.map(l, function(a) {
                        return a + ".update." + c
                    }).join(" "), o = 0; i > o; o++) {
                    var p = d.eq(o),
                        q = this.options.fields[b].row || this.options.row.selector,
                        r = p.closest(q),
                        s = "function" == typeof(this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, p, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container,
                        t = s && "tooltip" !== s && "popover" !== s ? a(s) : this._getMessageContainer(p, q);
                    s && "tooltip" !== s && "popover" !== s && t.addClass(this.options.err.clazz), t.find("." + m + "[data-" + c + "-validator][data-" + c + '-for="' + b + '"]').remove(), r.find("i[data-" + c + '-icon-for="' + b + '"]').remove(), p.off(n).on(n, function() {
                        h.updateStatus(a(this), h.STATUS_NOT_VALIDATED)
                    }), p.data(c + ".messages", t);
                    for (e in g) p.data(c + ".result." + e, this.STATUS_NOT_VALIDATED), k && o !== i - 1 || a("<small/>").css("display", "none").addClass(this.options.err.clazz).attr("data-" + c + "-validator", e).attr("data-" + c + "-for", b).attr("data-" + c + "-result", this.STATUS_NOT_VALIDATED).html(this._getMessage(b, e)).appendTo(t), f = g[e].alias || e, "function" == typeof FormValidation.Validator[f].init && FormValidation.Validator[f].init(this, p, this.options.fields[b].validators[e], e);
                    if (this.options.fields[b].icon !== !1 && "false" !== this.options.fields[b].icon && this.options.icon && this.options.icon.valid && this.options.icon.invalid && this.options.icon.validating && (!k || o === i - 1)) {
                        r.addClass(this.options.row.feedback);
                        var u = a("<i/>").css("display", "none").addClass(this.options.icon.feedback).attr("data-" + c + "-icon-for", b).insertAfter(p);
                        (k ? d : p).data(c + ".icon", u), ("tooltip" === s || "popover" === s) && ((k ? d : p).on(this.options.events.fieldError, function() {
                            r.addClass("fv-has-tooltip")
                        }).on(this.options.events.fieldSuccess, function() {
                            r.removeClass("fv-has-tooltip")
                        }), p.off("focus.container." + c).on("focus.container." + c, function() {
                            h._showTooltip(a(this), s)
                        }).off("blur.container." + c).on("blur.container." + c, function() {
                            h._hideTooltip(a(this), s)
                        })), "string" == typeof this.options.fields[b].icon && "true" !== this.options.fields[b].icon ? u.appendTo(a(this.options.fields[b].icon)) : this._fixIcon(p, u)
                    }
                }
                var v = [];
                for (e in g) f = g[e].alias || e, g[e].priority = parseInt(g[e].priority || FormValidation.Validator[f].priority || 1, 10), v.push({
                    validator: e,
                    priority: g[e].priority
                });
                v = v.sort(function(a, b) {
                    return a.priority - b.priority
                }), d.data(c + ".validators", v).on(this.options.events.fieldSuccess, function(a, b) {
                    var c = h.getOptions(b.field, null, "onSuccess");
                    c && FormValidation.Helper.call(c, [a, b])
                }).on(this.options.events.fieldError, function(a, b) {
                    var c = h.getOptions(b.field, null, "onError");
                    c && FormValidation.Helper.call(c, [a, b])
                }).on(this.options.events.fieldReset, function(a, b) {
                    var c = h.getOptions(b.field, null, "onReset");
                    c && FormValidation.Helper.call(c, [a, b])
                }).on(this.options.events.fieldStatus, function(a, b) {
                    var c = h.getOptions(b.field, null, "onStatus");
                    c && FormValidation.Helper.call(c, [a, b])
                }).on(this.options.events.validatorError, function(a, b) {
                    var c = h.getOptions(b.field, b.validator, "onError");
                    c && FormValidation.Helper.call(c, [a, b])
                }).on(this.options.events.validatorIgnored, function(a, b) {
                    var c = h.getOptions(b.field, b.validator, "onIgnored");
                    c && FormValidation.Helper.call(c, [a, b])
                }).on(this.options.events.validatorSuccess, function(a, b) {
                    var c = h.getOptions(b.field, b.validator, "onSuccess");
                    c && FormValidation.Helper.call(c, [a, b])
                }), this.onLiveChange(d, "live", function() {
                    h._exceedThreshold(a(this)) && h.validateField(a(this))
                }), d.trigger(a.Event(this.options.events.fieldInit), {
                    bv: this,
                    fv: this,
                    field: b,
                    element: d
                })
            }
        },
        _isExcluded: function(b) {
            var c = this._namespace,
                d = b.attr("data-" + c + "-excluded"),
                e = b.attr("data-" + c + "-field") || b.attr("name");
            switch (!0) {
                case !!e && this.options.fields && this.options.fields[e] && ("true" === this.options.fields[e].excluded || this.options.fields[e].excluded === !0):
                case "true" === d:
                case "" === d:
                    return !0;
                case !!e && this.options.fields && this.options.fields[e] && ("false" === this.options.fields[e].excluded || this.options.fields[e].excluded === !1):
                case "false" === d:
                    return !1;
                case !!e && this.options.fields && this.options.fields[e] && "function" == typeof this.options.fields[e].excluded:
                    return this.options.fields[e].excluded.call(this, b, this);
                case !!e && this.options.fields && this.options.fields[e] && "string" == typeof this.options.fields[e].excluded:
                case d:
                    return FormValidation.Helper.call(this.options.fields[e].excluded, [b, this]);
                default:
                    if (this.options.excluded) {
                        "string" == typeof this.options.excluded && (this.options.excluded = a.map(this.options.excluded.split(","), function(b) {
                            return a.trim(b)
                        }));
                        for (var f = this.options.excluded.length, g = 0; f > g; g++)
                            if ("string" == typeof this.options.excluded[g] && b.is(this.options.excluded[g]) || "function" == typeof this.options.excluded[g] && this.options.excluded[g].call(this, b, this) === !0) return !0
                    }
                    return !1
            }
        },
        _getFieldTrigger: function(a) {
            var b = this._namespace,
                c = a.data(b + ".trigger");
            if (c) return c;
            var d = a.attr("type"),
                e = a.attr("data-" + b + "-field"),
                f = "radio" === d || "checkbox" === d || "file" === d || "SELECT" === a.get(0).tagName ? "change" : this._ieVersion >= 10 && a.attr("placeholder") ? "keyup" : this._changeEvent;
            return c = ((this.options.fields[e] ? this.options.fields[e].trigger : null) || this.options.trigger || f).split(" "), a.data(b + ".trigger", c), c
        },
        _getMessage: function(a, b) {
            if (!this.options.fields[a] || !this.options.fields[a].validators) return "";
            var c = this.options.fields[a].validators,
                d = c[b] && c[b].alias ? c[b].alias : b;
            if (!FormValidation.Validator[d]) return "";
            switch (!0) {
                case !!c[b].message:
                    return c[b].message;
                case !!this.options.fields[a].message:
                    return this.options.fields[a].message;
                case !!this.options.message:
                    return this.options.message;
                case !!FormValidation.I18n[this.options.locale] && !!FormValidation.I18n[this.options.locale][d] && !!FormValidation.I18n[this.options.locale][d]["default"]:
                    return FormValidation.I18n[this.options.locale][d]["default"];
                default:
                    return this.DEFAULT_MESSAGE
            }
        },
        _getMessageContainer: function(a, b) {
            if (!this.options.err.parent) throw new Error("The err.parent option is not defined");
            var c = a.parent();
            if (c.is(b)) return c;
            var d = c.attr("class");
            return d && this.options.err.parent.test(d) ? c : this._getMessageContainer(c, b)
        },
        _parseAddOnOptions: function() {
            var a = this._namespace,
                b = this.$form.attr("data-" + a + "-addons"),
                c = this.options.addOns || {};
            if (b) {
                b = b.replace(/\s/g, "").split(",");
                for (var d = 0; d < b.length; d++) c[b[d]] || (c[b[d]] = {})
            }
            var e, f, g, h;
            for (e in c)
                if (FormValidation.AddOn[e]) {
                    if (f = FormValidation.AddOn[e].html5Attributes)
                        for (g in f) h = this.$form.attr("data-" + a + "-addons-" + e.toLowerCase() + "-" + g.toLowerCase()), h && (c[e][f[g]] = h)
                } else delete c[e];
            return c
        },
        _parseOptions: function(b) {
            var c, d, e, f, g, h, i, j, k, l = this._namespace,
                m = b.attr("name") || b.attr("data-" + l + "-field"),
                n = {},
                o = new RegExp("^data-" + l + "-([a-z]+)-alias$"),
                p = a.extend({}, FormValidation.Validator);
            a.each(b.get(0).attributes, function(a, b) {
                b.value && o.test(b.name) && (d = b.name.split("-")[2], p[b.value] && (p[d] = p[b.value], p[d].alias = b.value))
            });
            for (d in p)
                if (c = p[d], e = "data-" + l + "-" + d.toLowerCase(), f = b.attr(e) + "", k = "function" == typeof c.enableByHtml5 ? c.enableByHtml5(b) : null, k && "false" !== f || k !== !0 && ("" === f || "true" === f || e === f.toLowerCase())) {
                    c.html5Attributes = a.extend({}, {
                        message: "message",
                        onerror: "onError",
                        onreset: "onReset",
                        onsuccess: "onSuccess",
                        priority: "priority",
                        transformer: "transformer"
                    }, c.html5Attributes), n[d] = a.extend({}, k === !0 ? {} : k, n[d]), c.alias && (n[d].alias = c.alias);
                    for (j in c.html5Attributes) g = c.html5Attributes[j], h = "data-" + l + "-" + d.toLowerCase() + "-" + j, i = b.attr(h), i && ("true" === i || h === i.toLowerCase() ? i = !0 : "false" === i && (i = !1), n[d][g] = i)
                }
            var q = {
                    autoFocus: b.attr("data-" + l + "-autofocus"),
                    err: b.attr("data-" + l + "-err-container") || b.attr("data-" + l + "-container"),
                    enabled: b.attr("data-" + l + "-enabled"),
                    excluded: b.attr("data-" + l + "-excluded"),
                    icon: b.attr("data-" + l + "-icon") || b.attr("data-" + l + "-feedbackicons") || (this.options.fields && this.options.fields[m] ? this.options.fields[m].feedbackIcons : null),
                    message: b.attr("data-" + l + "-message"),
                    onError: b.attr("data-" + l + "-onerror"),
                    onReset: b.attr("data-" + l + "-onreset"),
                    onStatus: b.attr("data-" + l + "-onstatus"),
                    onSuccess: b.attr("data-" + l + "-onsuccess"),
                    row: b.attr("data-" + l + "-row") || b.attr("data-" + l + "-group") || (this.options.fields && this.options.fields[m] ? this.options.fields[m].group : null),
                    selector: b.attr("data-" + l + "-selector"),
                    threshold: b.attr("data-" + l + "-threshold"),
                    transformer: b.attr("data-" + l + "-transformer"),
                    trigger: b.attr("data-" + l + "-trigger"),
                    verbose: b.attr("data-" + l + "-verbose"),
                    validators: n
                },
                r = a.isEmptyObject(q),
                s = a.isEmptyObject(n);
            return !s || !r && this.options.fields && this.options.fields[m] ? q : null
        },
        _submit: function() {
            var b = this.isValid();
            if (null !== b) {
                var c = b ? this.options.events.formSuccess : this.options.events.formError,
                    d = a.Event(c);
                this.$form.trigger(d), this.$submitButton && (b ? this._onSuccess(d) : this._onError(d))
            }
        },
        _onError: function(b) {
            if (!b.isDefaultPrevented()) {
                if ("submitted" === this.options.live) {
                    this.options.live = "enabled";
                    var c = this;
                    for (var d in this.options.fields) ! function(b) {
                        var d = c.getFieldElements(b);
                        d.length && c.onLiveChange(d, "live", function() {
                            c._exceedThreshold(a(this)) && c.validateField(a(this))
                        })
                    }(d)
                }
                for (var e = this._namespace, f = 0; f < this.$invalidFields.length; f++) {
                    var g = this.$invalidFields.eq(f),
                        h = this.isOptionEnabled(g.attr("data-" + e + "-field"), "autoFocus");
                    if (h) {
                        g.focus();
                        break
                    }
                }
            }
        },
        _onFieldValidated: function(b, c) {
            var d = this._namespace,
                e = b.attr("data-" + d + "-field"),
                f = this.options.fields[e].validators,
                g = {},
                h = 0,
                i = {
                    bv: this,
                    fv: this,
                    field: e,
                    element: b,
                    validator: c,
                    result: b.data(d + ".response." + c)
                };
            if (c) switch (b.data(d + ".result." + c)) {
                case this.STATUS_INVALID:
                    b.trigger(a.Event(this.options.events.validatorError), i);
                    break;
                case this.STATUS_VALID:
                    b.trigger(a.Event(this.options.events.validatorSuccess), i);
                    break;
                case this.STATUS_IGNORED:
                    b.trigger(a.Event(this.options.events.validatorIgnored), i)
            }
            g[this.STATUS_NOT_VALIDATED] = 0, g[this.STATUS_VALIDATING] = 0, g[this.STATUS_INVALID] = 0, g[this.STATUS_VALID] = 0, g[this.STATUS_IGNORED] = 0;
            for (var j in f)
                if (f[j].enabled !== !1) {
                    h++;
                    var k = b.data(d + ".result." + j);
                    k && g[k]++
                }
            g[this.STATUS_VALID] + g[this.STATUS_IGNORED] === h ? (this.$invalidFields = this.$invalidFields.not(b), b.trigger(a.Event(this.options.events.fieldSuccess), i)) : (0 === g[this.STATUS_NOT_VALIDATED] || !this.isOptionEnabled(e, "verbose")) && 0 === g[this.STATUS_VALIDATING] && g[this.STATUS_INVALID] > 0 && (this.$invalidFields = this.$invalidFields.add(b), b.trigger(a.Event(this.options.events.fieldError), i))
        },
        _onSuccess: function(a) {
            a.isDefaultPrevented() || this.disableSubmitButtons(!0).defaultSubmit()
        },
        _fixIcon: function(a, b) {},
        _createTooltip: function(a, b, c) {},
        _destroyTooltip: function(a, b) {},
        _hideTooltip: function(a, b) {},
        _showTooltip: function(a, b) {},
        defaultSubmit: function() {
            var b = this._namespace;
            this.$submitButton && a("<input/>").attr({
                type: "hidden",
                name: this.$submitButton.attr("name")
            }).attr("data-" + b + "-submit-hidden", "").val(this.$submitButton.val()).appendTo(this.$form), this.$form.off("submit." + b).submit()
        },
        disableSubmitButtons: function(a) {
            return a ? "disabled" !== this.options.live && this.$form.find(this.options.button.selector).attr("disabled", "disabled").addClass(this.options.button.disabled) : this.$form.find(this.options.button.selector).removeAttr("disabled").removeClass(this.options.button.disabled), this
        },
        getFieldElements: function(b) {
            if (!this._cacheFields[b])
                if (this.options.fields[b] && this.options.fields[b].selector) {
                    var c = this.$form.find(this.options.fields[b].selector);
                    this._cacheFields[b] = c.length ? c : a(this.options.fields[b].selector)
                } else this._cacheFields[b] = this.$form.find('[name="' + b + '"]');
            return this._cacheFields[b]
        },
        getFieldValue: function(a, b) {
            var c, d = this._namespace;
            if ("string" == typeof a) {
                if (c = this.getFieldElements(a), 0 === c.length) return null
            } else c = a, a = c.attr("data-" + d + "-field");
            if (!a || !this.options.fields[a]) return c.val();
            var e = (this.options.fields[a].validators && this.options.fields[a].validators[b] ? this.options.fields[a].validators[b].transformer : null) || this.options.fields[a].transformer;
            return e ? FormValidation.Helper.call(e, [c, b, this]) : c.val()
        },
        getNamespace: function() {
            return this._namespace
        },
        getOptions: function(a, b, c) {
            var d = this._namespace;
            if (!a) return c ? this.options[c] : this.options;
            if ("object" == typeof a && (a = a.attr("data-" + d + "-field")), !this.options.fields[a]) return null;
            var e = this.options.fields[a];
            return b ? e.validators && e.validators[b] ? c ? e.validators[b][c] : e.validators[b] : null : c ? e[c] : e
        },
        getStatus: function(a, b) {
            var c = this._namespace;
            switch (typeof a) {
                case "object":
                    return a.data(c + ".result." + b);
                case "string":
                default:
                    return this.getFieldElements(a).eq(0).data(c + ".result." + b)
            }
        },
        isOptionEnabled: function(a, b) {
            return !this.options.fields[a] || "true" !== this.options.fields[a][b] && this.options.fields[a][b] !== !0 ? !this.options.fields[a] || "false" !== this.options.fields[a][b] && this.options.fields[a][b] !== !1 ? "true" === this.options[b] || this.options[b] === !0 : !1 : !0
        },
        isValid: function() {
            for (var a in this.options.fields) {
                var b = this.isValidField(a);
                if (null === b) return null;
                if (b === !1) return !1
            }
            return !0
        },
        isValidContainer: function(b) {
            var c = this,
                d = this._namespace,
                e = [],
                f = "string" == typeof b ? a(b) : b;
            if (0 === f.length) return !0;
            f.find("[data-" + d + "-field]").each(function() {
                var b = a(this);
                c._isExcluded(b) || e.push(b)
            });
            for (var g = e.length, h = this.options.err.clazz.split(" ").join("."), i = 0; g > i; i++) {
                var j = e[i],
                    k = j.attr("data-" + d + "-field"),
                    l = j.data(d + ".messages").find("." + h + "[data-" + d + "-validator][data-" + d + '-for="' + k + '"]');
                if (!this.options.fields || !this.options.fields[k] || "false" !== this.options.fields[k].enabled && this.options.fields[k].enabled !== !1) {
                    if (l.filter("[data-" + d + '-result="' + this.STATUS_INVALID + '"]').length > 0) return !1;
                    if (l.filter("[data-" + d + '-result="' + this.STATUS_NOT_VALIDATED + '"]').length > 0 || l.filter("[data-" + d + '-result="' + this.STATUS_VALIDATING + '"]').length > 0) return null
                }
            }
            return !0
        },
        isValidField: function(b) {
            var c = this._namespace,
                d = a([]);
            switch (typeof b) {
                case "object":
                    d = b, b = b.attr("data-" + c + "-field");
                    break;
                case "string":
                    d = this.getFieldElements(b)
            }
            if (0 === d.length || !this.options.fields[b] || "false" === this.options.fields[b].enabled || this.options.fields[b].enabled === !1) return !0;
            for (var e, f, g, h = d.attr("type"), i = "radio" === h || "checkbox" === h ? 1 : d.length, j = 0; i > j; j++)
                if (e = d.eq(j), !this._isExcluded(e))
                    for (f in this.options.fields[b].validators)
                        if (this.options.fields[b].validators[f].enabled !== !1) {
                            if (g = e.data(c + ".result." + f), g === this.STATUS_VALIDATING || g === this.STATUS_NOT_VALIDATED) return null;
                            if (g === this.STATUS_INVALID) return !1
                        }
            return !0
        },
        offLiveChange: function(b, c) {
            if (null === b || 0 === b.length) return this;
            var d = this._namespace,
                e = this._getFieldTrigger(b.eq(0)),
                f = a.map(e, function(a) {
                    return a + "." + c + "." + d
                }).join(" ");
            return b.off(f), this
        },
        onLiveChange: function(b, c, d) {
            if (null === b || 0 === b.length) return this;
            var e = this._namespace,
                f = this._getFieldTrigger(b.eq(0)),
                g = a.map(f, function(a) {
                    return a + "." + c + "." + e
                }).join(" ");
            switch (this.options.live) {
                case "submitted":
                    break;
                case "disabled":
                    b.off(g);
                    break;
                case "enabled":
                default:
                    b.off(g).on(g, function(a) {
                        d.apply(this, arguments)
                    })
            }
            return this
        },
        updateMessage: function(b, c, d) {
            var e = this._namespace,
                f = a([]);
            switch (typeof b) {
                case "object":
                    f = b, b = b.attr("data-" + e + "-field");
                    break;
                case "string":
                    f = this.getFieldElements(b)
            }
            var g = this.options.err.clazz.split(" ").join(".");
            return f.each(function() {
                a(this).data(e + ".messages").find("." + g + "[data-" + e + '-validator="' + c + '"][data-' + e + '-for="' + b + '"]').html(d)
            }), this
        },
        updateStatus: function(b, c, d) {
            var e = this._namespace,
                f = a([]);
            switch (typeof b) {
                case "object":
                    f = b, b = b.attr("data-" + e + "-field");
                    break;
                case "string":
                    f = this.getFieldElements(b)
            }
            if (!b || !this.options.fields[b]) return this;
            c === this.STATUS_NOT_VALIDATED && (this._submitIfValid = !1);
            for (var g = this, h = f.attr("type"), i = this.options.fields[b].row || this.options.row.selector, j = "radio" === h || "checkbox" === h ? 1 : f.length, k = this.options.err.clazz.split(" ").join("."), l = 0; j > l; l++) {
                var m = f.eq(l);
                if (!this._isExcluded(m)) {
                    var n, o, p = m.closest(i),
                        q = m.data(e + ".messages"),
                        r = q.find("." + k + "[data-" + e + "-validator][data-" + e + '-for="' + b + '"]'),
                        s = d ? r.filter("[data-" + e + '-validator="' + d + '"]') : r,
                        t = m.data(e + ".icon"),
                        u = "function" == typeof(this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, m, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container,
                        v = null;
                    if (d) m.data(e + ".result." + d, c);
                    else
                        for (var w in this.options.fields[b].validators) m.data(e + ".result." + w, c);
                    switch (s.attr("data-" + e + "-result", c), c) {
                        case this.STATUS_VALIDATING:
                            v = null, this.disableSubmitButtons(!0), m.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), p.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), t && t.removeClass(this.options.icon.valid).removeClass(this.options.icon.invalid).addClass(this.options.icon.validating).show();
                            break;
                        case this.STATUS_INVALID:
                            v = !1, this.disableSubmitButtons(!0), m.removeClass(this.options.control.valid).addClass(this.options.control.invalid), p.removeClass(this.options.row.valid).addClass(this.options.row.invalid), t && t.removeClass(this.options.icon.valid).removeClass(this.options.icon.validating).addClass(this.options.icon.invalid).show();
                            break;
                        case this.STATUS_IGNORED:
                        case this.STATUS_VALID:
                            n = r.filter("[data-" + e + '-result="' + this.STATUS_VALIDATING + '"]').length > 0, o = r.filter("[data-" + e + '-result="' + this.STATUS_NOT_VALIDATED + '"]').length > 0;
                            var x = r.filter("[data-" + e + '-result="' + this.STATUS_IGNORED + '"]').length;
                            v = n || o ? null : r.filter("[data-" + e + '-result="' + this.STATUS_VALID + '"]').length + x === r.length, m.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), v === !0 ? (this.disableSubmitButtons(this.isValid() === !1), c === this.STATUS_VALID && m.addClass(this.options.control.valid)) : v === !1 && (this.disableSubmitButtons(!0), c === this.STATUS_VALID && m.addClass(this.options.control.invalid)), t && (t.removeClass(this.options.icon.invalid).removeClass(this.options.icon.validating).removeClass(this.options.icon.valid), (c === this.STATUS_VALID || x !== r.length) && t.addClass(n ? this.options.icon.validating : null === v ? "" : v ? this.options.icon.valid : this.options.icon.invalid).show());
                            var y = this.isValidContainer(p);
                            null !== y && (p.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), (c === this.STATUS_VALID || x !== r.length) && p.addClass(y ? this.options.row.valid : this.options.row.invalid));
                            break;
                        case this.STATUS_NOT_VALIDATED:
                        default:
                            v = null, this.disableSubmitButtons(!1), m.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), p.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), t && t.removeClass(this.options.icon.valid).removeClass(this.options.icon.invalid).removeClass(this.options.icon.validating).hide()
                    }!t || "tooltip" !== u && "popover" !== u ? c === this.STATUS_INVALID ? s.show() : s.hide() : v === !1 ? this._createTooltip(m, r.filter("[data-" + e + '-result="' + g.STATUS_INVALID + '"]').eq(0).html(), u) : this._destroyTooltip(m, u), m.trigger(a.Event(this.options.events.fieldStatus), {
                        bv: this,
                        fv: this,
                        field: b,
                        element: m,
                        status: c,
                        validator: d
                    }), this._onFieldValidated(m, d)
                }
            }
            return this
        },
        validate: function() {
            if (a.isEmptyObject(this.options.fields)) return this._submit(), this;
            this.$form.trigger(a.Event(this.options.events.formPreValidate)), this.disableSubmitButtons(!0), this._submitIfValid = !1;
            for (var b in this.options.fields) this.validateField(b);
            return this._submit(), this._submitIfValid = !0, this
        },
        validateField: function(b) {
            var c = this._namespace,
                d = a([]);
            switch (typeof b) {
                case "object":
                    d = b, b = b.attr("data-" + c + "-field");
                    break;
                case "string":
                    d = this.getFieldElements(b)
            }
            if (0 === d.length || !this.options.fields[b] || "false" === this.options.fields[b].enabled || this.options.fields[b].enabled === !1) return this;
            for (var e, f, g, h = this, i = d.attr("type"), j = "radio" !== i && "checkbox" !== i || "disabled" === this.options.live ? d.length : 1, k = "radio" === i || "checkbox" === i, l = this.options.fields[b].validators, m = this.isOptionEnabled(b, "verbose"), n = 0; j > n; n++) {
                var o = d.eq(n);
                if (!this._isExcluded(o))
                    for (var p = !1, q = o.data(c + ".validators"), r = q.length, s = 0; r > s && (e = q[s].validator, o.data(c + ".dfs." + e) && o.data(c + ".dfs." + e).reject(), !p); s++) {
                        var t = o.data(c + ".result." + e);
                        if (t !== this.STATUS_VALID && t !== this.STATUS_INVALID)
                            if (l[e].enabled !== !1)
                                if (o.data(c + ".result." + e, this.STATUS_VALIDATING), f = l[e].alias || e, g = FormValidation.Validator[f].validate(this, o, l[e], e), "object" == typeof g && g.resolve) this.updateStatus(k ? b : o, this.STATUS_VALIDATING, e), o.data(c + ".dfs." + e, g), g.done(function(a, b, d) {
                                    a.removeData(c + ".dfs." + b).data(c + ".response." + b, d), d.message && h.updateMessage(a, b, d.message), h.updateStatus(k ? a.attr("data-" + c + "-field") : a, d.valid === !0 ? h.STATUS_VALID : d.valid === !1 ? h.STATUS_INVALID : h.STATUS_IGNORED, b), d.valid && h._submitIfValid === !0 ? h._submit() : d.valid !== !1 || m || (p = !0)
                                });
                                else if ("object" == typeof g && void 0 !== g.valid) {
                            if (o.data(c + ".response." + e, g), g.message && this.updateMessage(k ? b : o, e, g.message), this.updateStatus(k ? b : o, g.valid === !0 ? this.STATUS_VALID : g.valid === !1 ? this.STATUS_INVALID : this.STATUS_IGNORED, e), g.valid === !1 && !m) break
                        } else if ("boolean" == typeof g) {
                            if (o.data(c + ".response." + e, g), this.updateStatus(k ? b : o, g ? this.STATUS_VALID : this.STATUS_INVALID, e), !g && !m) break
                        } else null === g && (o.data(c + ".response." + e, g), this.updateStatus(k ? b : o, this.STATUS_IGNORED, e));
                        else this.updateStatus(k ? b : o, this.STATUS_IGNORED, e);
                        else this._onFieldValidated(o, e)
                    }
            }
            return this
        },
        addField: function(b, c) {
            var d = this._namespace,
                e = a([]);
            switch (typeof b) {
                case "object":
                    e = b, b = b.attr("data-" + d + "-field") || b.attr("name");
                    break;
                case "string":
                    delete this._cacheFields[b], e = this.getFieldElements(b)
            }
            e.attr("data-" + d + "-field", b);
            for (var f = e.attr("type"), g = "radio" === f || "checkbox" === f ? 1 : e.length, h = 0; g > h; h++) {
                var i = e.eq(h),
                    j = this._parseOptions(i);
                j = null === j ? c : a.extend(!0, j, c), this.options.fields[b] = a.extend(!0, this.options.fields[b], j), this._cacheFields[b] = this._cacheFields[b] ? this._cacheFields[b].add(i) : i, this._initField("checkbox" === f || "radio" === f ? b : i)
            }
            return this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.fieldAdded), {
                field: b,
                element: e,
                options: this.options.fields[b]
            }), this
        },
        destroy: function() {
            var a, b, c, d, e, f, g, h, i = this._namespace;
            for (b in this.options.fields)
                for (c = this.getFieldElements(b), a = 0; a < c.length; a++) {
                    d = c.eq(a);
                    for (e in this.options.fields[b].validators) d.data(i + ".dfs." + e) && d.data(i + ".dfs." + e).reject(), d.removeData(i + ".result." + e).removeData(i + ".response." + e).removeData(i + ".dfs." + e), h = this.options.fields[b].validators[e].alias || e, "function" == typeof FormValidation.Validator[h].destroy && FormValidation.Validator[h].destroy(this, d, this.options.fields[b].validators[e], e)
                }
            var j = this.options.err.clazz.split(" ").join(".");
            for (b in this.options.fields)
                for (c = this.getFieldElements(b), g = this.options.fields[b].row || this.options.row.selector, a = 0; a < c.length; a++) {
                    d = c.eq(a);
                    var k = d.data(i + ".messages");
                    k && k.find("." + j + "[data-" + i + "-validator][data-" + i + '-for="' + b + '"]').remove(), d.removeData(i + ".messages").removeData(i + ".validators").closest(g).removeClass(this.options.row.valid).removeClass(this.options.row.invalid).removeClass(this.options.row.feedback).end().off("." + i).removeAttr("data-" + i + "-field");
                    var l = "function" == typeof(this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, d, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container;
                    ("tooltip" === l || "popover" === l) && this._destroyTooltip(d, l), f = d.data(i + ".icon"), f && f.remove(), d.removeData(i + ".icon").removeData(i + ".trigger")
                }
            for (var m in this.options.addOns) "function" == typeof FormValidation.AddOn[m].destroy && FormValidation.AddOn[m].destroy(this, this.options.addOns[m]);
            this.disableSubmitButtons(!1), this.$hiddenButton.remove(), this.$form.removeClass(this.options.elementClass).off("." + i).removeData("bootstrapValidator").removeData("formValidation").find("[data-" + i + "-submit-hidden]").remove().end().find('[type="submit"]').off("click." + i)
        },
        enableFieldValidators: function(a, b, c) {
            var d = this.options.fields[a].validators;
            if (c && d && d[c] && d[c].enabled !== b) this.options.fields[a].validators[c].enabled = b, this.updateStatus(a, this.STATUS_NOT_VALIDATED, c);
            else if (!c && this.options.fields[a].enabled !== b) {
                this.options.fields[a].enabled = b;
                for (var e in d) this.enableFieldValidators(a, b, e)
            }
            return this
        },
        getDynamicOption: function(a, b) {
            var c = "string" == typeof a ? this.getFieldElements(a) : a,
                d = c.val();
            if ("function" == typeof b) return FormValidation.Helper.call(b, [d, this, c]);
            if ("string" == typeof b) {
                var e = this.getFieldElements(b);
                return e.length ? e.val() : FormValidation.Helper.call(b, [d, this, c]) || b
            }
            return null
        },
        getForm: function() {
            return this.$form
        },
        getInvalidFields: function() {
            return this.$invalidFields
        },
        getLocale: function() {
            return this.options.locale
        },
        getMessages: function(b, c) {
            var d = this,
                e = this._namespace,
                f = [],
                g = a([]);
            switch (!0) {
                case b && "object" == typeof b:
                    g = b;
                    break;
                case b && "string" == typeof b:
                    var h = this.getFieldElements(b);
                    if (h.length > 0) {
                        var i = h.attr("type");
                        g = "radio" === i || "checkbox" === i ? h.eq(0) : h
                    }
                    break;
                default:
                    g = this.$invalidFields
            }
            var j = c ? "[data-" + e + '-validator="' + c + '"]' : "",
                k = this.options.err.clazz.split(" ").join(".");
            return g.each(function() {
                f = f.concat(a(this).data(e + ".messages").find("." + k + "[data-" + e + '-for="' + a(this).attr("data-" + e + "-field") + '"][data-' + e + '-result="' + d.STATUS_INVALID + '"]' + j).map(function() {
                    var b = a(this).attr("data-" + e + "-validator"),
                        c = a(this).attr("data-" + e + "-for");
                    return d.options.fields[c].validators[b].enabled === !1 ? "" : a(this).html()
                }).get())
            }), f
        },
        getSubmitButton: function() {
            return this.$submitButton
        },
        removeField: function(b) {
            var c = this._namespace,
                d = a([]);
            switch (typeof b) {
                case "object":
                    d = b, b = b.attr("data-" + c + "-field") || b.attr("name"), d.attr("data-" + c + "-field", b);
                    break;
                case "string":
                    d = this.getFieldElements(b)
            }
            if (0 === d.length) return this;
            for (var e = d.attr("type"), f = "radio" === e || "checkbox" === e ? 1 : d.length, g = 0; f > g; g++) {
                var h = d.eq(g);
                this.$invalidFields = this.$invalidFields.not(h), this._cacheFields[b] = this._cacheFields[b].not(h)
            }
            return this._cacheFields[b] && 0 !== this._cacheFields[b].length || delete this.options.fields[b], ("checkbox" === e || "radio" === e) && this._initField(b), this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.fieldRemoved), {
                field: b,
                element: d
            }), this
        },
        resetField: function(b, c) {
            var d = this._namespace,
                e = a([]);
            switch (typeof b) {
                case "object":
                    e = b, b = b.attr("data-" + d + "-field");
                    break;
                case "string":
                    e = this.getFieldElements(b)
            }
            var f = 0,
                g = e.length;
            if (this.options.fields[b])
                for (f = 0; g > f; f++)
                    for (var h in this.options.fields[b].validators) e.eq(f).removeData(d + ".dfs." + h);
            if (c) {
                var i = e.attr("type");
                "radio" === i || "checkbox" === i ? e.prop("checked", !1).removeAttr("selected") : e.val("")
            }
            for (this.updateStatus(b, this.STATUS_NOT_VALIDATED), f = 0; g > f; f++) e.eq(f).trigger(a.Event(this.options.events.fieldReset), {
                fv: this,
                field: b,
                element: e.eq(f),
                resetValue: c
            });
            return this
        },
        resetForm: function(b) {
            for (var c in this.options.fields) this.resetField(c, b);
            return this.$invalidFields = a([]), this.$submitButton = null, this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.formReset), {
                fv: this,
                resetValue: b
            }), this
        },
        revalidateField: function(a) {
            return this.updateStatus(a, this.STATUS_NOT_VALIDATED).validateField(a), this
        },
        setLocale: function(b) {
            return this.options.locale = b, this.$form.trigger(a.Event(this.options.events.localeChanged), {
                locale: b,
                bv: this,
                fv: this
            }), this
        },
        updateOption: function(a, b, c, d) {
            var e = this._namespace;
            return "object" == typeof a && (a = a.attr("data-" + e + "-field")), this.options.fields[a] && this.options.fields[a].validators[b] && (this.options.fields[a].validators[b][c] = d, this.updateStatus(a, this.STATUS_NOT_VALIDATED, b)), this
        },
        validateContainer: function(b) {
            var c = this,
                d = this._namespace,
                e = [],
                f = "string" == typeof b ? a(b) : b;
            if (0 === f.length) return this;
            f.find("[data-" + d + "-field]").each(function() {
                var b = a(this);
                c._isExcluded(b) || e.push(b)
            });
            for (var g = e.length, h = 0; g > h; h++) this.validateField(e[h]);
            return this
        }
    }, a.fn.formValidation = function(b) {
        var c = arguments;
        return this.each(function() {
            var d = a(this),
                e = d.data("formValidation"),
                f = "object" == typeof b && b;
            if (!e) {
                var g = (f.framework || d.attr("data-fv-framework") || "bootstrap").toLowerCase(),
                    h = g.substr(0, 1).toUpperCase() + g.substr(1);
                if ("undefined" == typeof FormValidation.Framework[h]) throw new Error("The class FormValidation.Framework." + h + " is not implemented");
                e = new FormValidation.Framework[h](this, f), d.addClass("fv-form-" + g).data("formValidation", e)
            }
            "string" == typeof b && e[b].apply(e, Array.prototype.slice.call(c, 1))
        })
    }, a.fn.formValidation.Constructor = FormValidation.Base, a.fn.formValidation.DEFAULT_MESSAGE = "This value is not valid", a.fn.formValidation.DEFAULT_OPTIONS = {
        autoFocus: !0,
        declarative: !0,
        elementClass: "fv-form",
        events: {
            formInit: "init.form.fv",
            formPreValidate: "prevalidate.form.fv",
            formError: "err.form.fv",
            formReset: "rst.form.fv",
            formSuccess: "success.form.fv",
            fieldAdded: "added.field.fv",
            fieldRemoved: "removed.field.fv",
            fieldInit: "init.field.fv",
            fieldError: "err.field.fv",
            fieldReset: "rst.field.fv",
            fieldSuccess: "success.field.fv",
            fieldStatus: "status.field.fv",
            localeChanged: "changed.locale.fv",
            validatorError: "err.validator.fv",
            validatorSuccess: "success.validator.fv",
            validatorIgnored: "ignored.validator.fv"
        },
        excluded: [":disabled", ":hidden", ":not(:visible)"],
        fields: null,
        live: "enabled",
        locale: "en_US",
        message: null,
        threshold: null,
        verbose: !0,
        button: {
            selector: '[type="submit"]:not([formnovalidate])',
            disabled: ""
        },
        control: {
            valid: "",
            invalid: ""
        },
        err: {
            clazz: "",
            container: null,
            parent: null
        },
        icon: {
            valid: null,
            invalid: null,
            validating: null,
            feedback: ""
        },
        row: {
            selector: null,
            valid: "",
            invalid: "",
            feedback: ""
        }
    }
}(jQuery),
function(a) {
    FormValidation.Helper = {
        call: function(a, b) {
            if ("function" == typeof a) return a.apply(this, b);
            if ("string" == typeof a) {
                "()" === a.substring(a.length - 2) && (a = a.substring(0, a.length - 2));
                for (var c = a.split("."), d = c.pop(), e = window, f = 0; f < c.length; f++) e = e[c[f]];
                return "undefined" == typeof e[d] ? null : e[d].apply(this, b)
            }
        },
        date: function(a, b, c, d) {
            if (isNaN(a) || isNaN(b) || isNaN(c)) return !1;
            if (c.length > 2 || b.length > 2 || a.length > 4) return !1;
            if (c = parseInt(c, 10), b = parseInt(b, 10), a = parseInt(a, 10), 1e3 > a || a > 9999 || 0 >= b || b > 12) return !1;
            var e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if ((a % 400 === 0 || a % 100 !== 0 && a % 4 === 0) && (e[1] = 29), 0 >= c || c > e[b - 1]) return !1;
            if (d === !0) {
                var f = new Date,
                    g = f.getFullYear(),
                    h = f.getMonth(),
                    i = f.getDate();
                return g > a || a === g && h > b - 1 || a === g && b - 1 === h && i > c
            }
            return !0
        },
        format: function(b, c) {
            a.isArray(c) || (c = [c]);
            for (var d in c) b = b.replace("%s", c[d]);
            return b
        },
        luhn: function(a) {
            for (var b = a.length, c = 0, d = [
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                ], e = 0; b--;) e += d[c][parseInt(a.charAt(b), 10)], c ^= 1;
            return e % 10 === 0 && e > 0
        },
        mod11And10: function(a) {
            for (var b = 5, c = a.length, d = 0; c > d; d++) b = (2 * (b || 10) % 11 + parseInt(a.charAt(d), 10)) % 10;
            return 1 === b
        },
        mod37And36: function(a, b) {
            b = b || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var c = b.length, d = a.length, e = Math.floor(c / 2), f = 0; d > f; f++) e = (2 * (e || c) % (c + 1) + b.indexOf(a.charAt(f))) % c;
            return 1 === e
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            between: {
                "default": "Please enter a value between %s and %s",
                notInclusive: "Please enter a value between %s and %s strictly"
            }
        }
    }), FormValidation.Validator.between = {
        html5Attributes: {
            message: "message",
            min: "min",
            max: "max",
            inclusive: "inclusive"
        },
        enableByHtml5: function(a) {
            return "range" === a.attr("type") ? {
                min: a.attr("min"),
                max: a.attr("max")
            } : !1
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            f = this._format(f);
            var g = b.getLocale(),
                h = a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min),
                i = a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max),
                j = this._format(h),
                k = this._format(i);
            return d.inclusive === !0 || void 0 === d.inclusive ? {
                valid: a.isNumeric(f) && parseFloat(f) >= j && parseFloat(f) <= k,
                message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].between["default"], [h, i])
            } : {
                valid: a.isNumeric(f) && parseFloat(f) > j && parseFloat(f) < k,
                message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].between.notInclusive, [h, i])
            }
        },
        _format: function(a) {
            return (a + "").replace(",", ".")
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            callback: {
                "default": "Please enter a valid value"
            }
        }
    }), FormValidation.Validator.callback = {
        priority: 999,
        html5Attributes: {
            message: "message",
            callback: "callback"
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e),
                g = new a.Deferred,
                h = {
                    valid: !0
                };
            if (d.callback) {
                var i = FormValidation.Helper.call(d.callback, [f, b, c]);
                h = "boolean" == typeof i || null === i ? {
                    valid: i
                } : i
            }
            return g.resolve(c, e, h), g
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            choice: {
                "default": "Please enter a valid value",
                less: "Please choose %s options at minimum",
                more: "Please choose %s options at maximum",
                between: "Please choose %s - %s options"
            }
        }
    }), FormValidation.Validator.choice = {
        html5Attributes: {
            message: "message",
            min: "min",
            max: "max"
        },
        validate: function(b, c, d, e) {
            var f = b.getLocale(),
                g = b.getNamespace(),
                h = c.is("select") ? b.getFieldElements(c.attr("data-" + g + "-field")).find("option").filter(":selected").length : b.getFieldElements(c.attr("data-" + g + "-field")).filter(":checked").length,
                i = d.min ? a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min) : null,
                j = d.max ? a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max) : null,
                k = !0,
                l = d.message || FormValidation.I18n[f].choice["default"];
            switch ((i && h < parseInt(i, 10) || j && h > parseInt(j, 10)) && (k = !1), !0) {
                case !!i && !!j:
                    l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.between, [parseInt(i, 10), parseInt(j, 10)]);
                    break;
                case !!i:
                    l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.less, parseInt(i, 10));
                    break;
                case !!j:
                    l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.more, parseInt(j, 10))
            }
            return {
                valid: k,
                message: l
            }
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            color: {
                "default": "Please enter a valid color"
            }
        }
    }), FormValidation.Validator.color = {
        html5Attributes: {
            message: "message",
            type: "type"
        },
        enableByHtml5: function(a) {
            return "color" === a.attr("type")
        },
        SUPPORTED_TYPES: ["hex", "rgb", "rgba", "hsl", "hsla", "keyword"],
        KEYWORD_COLORS: ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            if (this.enableByHtml5(c)) return /^#[0-9A-F]{6}$/i.test(f);
            var g = d.type || this.SUPPORTED_TYPES;
            a.isArray(g) || (g = g.replace(/s/g, "").split(","));
            for (var h, i, j = !1, k = 0; k < g.length; k++)
                if (i = g[k], h = "_" + i.toLowerCase(), j = j || this[h](f)) return !0;
            return !1
        },
        _hex: function(a) {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)
        },
        _hsl: function(a) {
            return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(a)
        },
        _hsla: function(a) {
            return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(a)
        },
        _keyword: function(b) {
            return a.inArray(b, this.KEYWORD_COLORS) >= 0
        },
        _rgb: function(a) {
            var b = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/,
                c = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
            return b.test(a) || c.test(a)
        },
        _rgba: function(a) {
            var b = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/,
                c = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
            return b.test(a) || c.test(a)
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            creditCard: {
                "default": "Please enter a valid credit card number"
            }
        }
    }), FormValidation.Validator.creditCard = {
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            if (/[^0-9-\s]+/.test(f)) return !1;
            if (f = f.replace(/\D/g, ""), !FormValidation.Helper.luhn(f)) return !1;
            var g, h, i = {
                AMERICAN_EXPRESS: {
                    length: [15],
                    prefix: ["34", "37"]
                },
                DANKORT: {
                    length: [16],
                    prefix: ["5019"]
                },
                DINERS_CLUB: {
                    length: [14],
                    prefix: ["300", "301", "302", "303", "304", "305", "36"]
                },
                DINERS_CLUB_US: {
                    length: [16],
                    prefix: ["54", "55"]
                },
                DISCOVER: {
                    length: [16],
                    prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
                },
                ELO: {
                    length: [16],
                    prefix: ["4011", "4312", "4389", "4514", "4573", "4576", "5041", "5066", "5067", "509", "6277", "6362", "6363", "650", "6516", "6550"]
                },
                FORBRUGSFORENINGEN: {
                    length: [16],
                    prefix: ["600722"]
                },
                JCB: {
                    length: [16],
                    prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]
                },
                LASER: {
                    length: [16, 17, 18, 19],
                    prefix: ["6304", "6706", "6771", "6709"]
                },
                MAESTRO: {
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    prefix: ["5018", "5020", "5038", "5868", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
                },
                MASTERCARD: {
                    length: [16],
                    prefix: ["51", "52", "53", "54", "55"]
                },
                SOLO: {
                    length: [16, 18, 19],
                    prefix: ["6334", "6767"]
                },
                UNIONPAY: {
                    length: [16, 17, 18, 19],
                    prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
                },
                VISA_ELECTRON: {
                    length: [16],
                    prefix: ["4026", "417500", "4405", "4508", "4844", "4913", "4917"]
                },
                VISA: {
                    length: [16],
                    prefix: ["4"]
                }
            };
            for (g in i)
                for (h in i[g].prefix)
                    if (f.substr(0, i[g].prefix[h].length) === i[g].prefix[h] && -1 !== a.inArray(f.length, i[g].length)) return {
                        valid: !0,
                        type: g
                    };
            return !1
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            date: {
                "default": "Please enter a valid date",
                min: "Please enter a date after %s",
                max: "Please enter a date before %s",
                range: "Please enter a date in the range %s - %s"
            }
        }
    }), FormValidation.Validator.date = {
        html5Attributes: {
            message: "message",
            format: "format",
            min: "min",
            max: "max",
            separator: "separator"
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            d.format = d.format || "MM/DD/YYYY", "date" === c.attr("type") && (d.format = "YYYY-MM-DD");
            var g = b.getLocale(),
                h = d.message || FormValidation.I18n[g].date["default"],
                i = d.format.split(" "),
                j = i[0],
                k = i.length > 1 ? i[1] : null,
                l = i.length > 2 ? i[2] : null,
                m = f.split(" "),
                n = m[0],
                o = m.length > 1 ? m[1] : null;
            if (i.length !== m.length) return {
                valid: !1,
                message: h
            };
            var p = d.separator;
            if (p || (p = -1 !== n.indexOf("/") ? "/" : -1 !== n.indexOf("-") ? "-" : -1 !== n.indexOf(".") ? "." : null), null === p || -1 === n.indexOf(p)) return {
                valid: !1,
                message: h
            };
            if (n = n.split(p), j = j.split(p), n.length !== j.length) return {
                valid: !1,
                message: h
            };
            var q = n[a.inArray("YYYY", j)],
                r = n[a.inArray("MM", j)],
                s = n[a.inArray("DD", j)];
            if (!q || !r || !s || 4 !== q.length) return {
                valid: !1,
                message: h
            };
            var t = null,
                u = null,
                v = null;
            if (k) {
                if (k = k.split(":"), o = o.split(":"), k.length !== o.length) return {
                    valid: !1,
                    message: h
                };
                if (u = o.length > 0 ? o[0] : null, t = o.length > 1 ? o[1] : null, v = o.length > 2 ? o[2] : null, "" === u || "" === t || "" === v) return {
                    valid: !1,
                    message: h
                };
                if (v) {
                    if (isNaN(v) || v.length > 2) return {
                        valid: !1,
                        message: h
                    };
                    if (v = parseInt(v, 10), 0 > v || v > 60) return {
                        valid: !1,
                        message: h
                    }
                }
                if (u) {
                    if (isNaN(u) || u.length > 2) return {
                        valid: !1,
                        message: h
                    };
                    if (u = parseInt(u, 10), 0 > u || u >= 24 || l && u > 12) return {
                        valid: !1,
                        message: h
                    }
                }
                if (t) {
                    if (isNaN(t) || t.length > 2) return {
                        valid: !1,
                        message: h
                    };
                    if (t = parseInt(t, 10), 0 > t || t > 59) return {
                        valid: !1,
                        message: h
                    }
                }
            }
            var w = FormValidation.Helper.date(q, r, s),
                x = null,
                y = null,
                z = d.min,
                A = d.max;
            switch (z && (x = z instanceof Date ? z : this._parseDate(z, j, p) || this._parseDate(b.getDynamicOption(c, z), j, p), z = this._formatDate(x, d.format)), A && (y = A instanceof Date ? A : this._parseDate(A, j, p) || this._parseDate(b.getDynamicOption(c, A), j, p), A = this._formatDate(y, d.format)), n = new Date(q, r - 1, s, u, t, v), !0) {
                case z && !A && w:
                    w = n.getTime() >= x.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.min, z);
                    break;
                case A && !z && w:
                    w = n.getTime() <= y.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.max, A);
                    break;
                case A && z && w:
                    w = n.getTime() <= y.getTime() && n.getTime() >= x.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.range, [z, A])
            }
            return {
                valid: w,
                date: n,
                message: h
            }
        },
        _parseDate: function(b, c, d) {
            if (b instanceof Date) return b;
            if ("string" != typeof b) return null;
            var e = a.inArray("YYYY", c),
                f = a.inArray("MM", c),
                g = a.inArray("DD", c);
            if (-1 === e || -1 === f || -1 === g) return null;
            var h = 0,
                i = 0,
                j = 0,
                k = b.split(" "),
                l = k[0].split(d);
            if (l.length < 3) return null;
            if (k.length > 1) {
                var m = k[1].split(":");
                i = m.length > 0 ? m[0] : null, h = m.length > 1 ? m[1] : null, j = m.length > 2 ? m[2] : null
            }
            return new Date(l[e], l[f] - 1, l[g], i, h, j)
        },
        _formatDate: function(a, b) {
            b = b.replace(/Y/g, "y").replace(/M/g, "m").replace(/D/g, "d").replace(/:m/g, ":M").replace(/:mm/g, ":MM").replace(/:S/, ":s").replace(/:SS/, ":ss");
            var c = {
                d: function(a) {
                    return a.getDate()
                },
                dd: function(a) {
                    var b = a.getDate();
                    return 10 > b ? "0" + b : b
                },
                m: function(a) {
                    return a.getMonth() + 1
                },
                mm: function(a) {
                    var b = a.getMonth() + 1;
                    return 10 > b ? "0" + b : b
                },
                yy: function(a) {
                    return ("" + a.getFullYear()).substr(2)
                },
                yyyy: function(a) {
                    return a.getFullYear()
                },
                h: function(a) {
                    return a.getHours() % 12 || 12
                },
                hh: function(a) {
                    var b = a.getHours() % 12 || 12;
                    return 10 > b ? "0" + b : b
                },
                H: function(a) {
                    return a.getHours()
                },
                HH: function(a) {
                    var b = a.getHours();
                    return 10 > b ? "0" + b : b
                },
                M: function(a) {
                    return a.getMinutes()
                },
                MM: function(a) {
                    var b = a.getMinutes();
                    return 10 > b ? "0" + b : b
                },
                s: function(a) {
                    return a.getSeconds()
                },
                ss: function(a) {
                    var b = a.getSeconds();
                    return 10 > b ? "0" + b : b
                }
            };
            return b.replace(/d{1,4}|m{1,4}|yy(?:yy)?|([HhMs])\1?|"[^"]*"|'[^']*'/g, function(b) {
                return c[b] ? c[b](a) : b.slice(1, b.length - 1)
            })
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            different: {
                "default": "Please enter a different value"
            }
        }
    }), FormValidation.Validator.different = {
        html5Attributes: {
            message: "message",
            field: "field"
        },
        init: function(b, c, d, e) {
            for (var f = d.field.split(","), g = 0; g < f.length; g++) {
                var h = b.getFieldElements(a.trim(f[g]));
                b.onLiveChange(h, "live_" + e, function() {
                    var a = b.getStatus(c, e);
                    a !== b.STATUS_NOT_VALIDATED && b.revalidateField(c)
                })
            }
        },
        destroy: function(b, c, d, e) {
            for (var f = d.field.split(","), g = 0; g < f.length; g++) {
                var h = b.getFieldElements(a.trim(f[g]));
                b.offLiveChange(h, "live_" + e)
            }
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            for (var g = d.field.split(","), h = !0, i = 0; i < g.length; i++) {
                var j = b.getFieldElements(a.trim(g[i]));
                if (null != j && 0 !== j.length) {
                    var k = b.getFieldValue(j, e);
                    f === k ? h = !1 : "" !== k && b.updateStatus(j, b.STATUS_VALID, e)
                }
            }
            return h
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            digits: {
                "default": "Please enter only digits"
            }
        }
    }), FormValidation.Validator.digits = {
        validate: function(a, b, c, d) {
            var e = a.getFieldValue(b, d);
            return "" === e ? !0 : /^\d+$/.test(e)
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            emailAddress: {
                "default": "Please enter a valid email address"
            }
        }
    }), FormValidation.Validator.emailAddress = {
        html5Attributes: {
            message: "message",
            multiple: "multiple",
            separator: "separator"
        },
        enableByHtml5: function(a) {
            return "email" === a.attr("type")
        },
        validate: function(a, b, c, d) {
            var e = a.getFieldValue(b, d);
            if ("" === e) return !0;
            var f = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                g = c.multiple === !0 || "true" === c.multiple;
            if (g) {
                for (var h = c.separator || /[,;]/, i = this._splitEmailAddresses(e, h), j = 0; j < i.length; j++)
                    if (!f.test(i[j])) return !1;
                return !0
            }
            return f.test(e)
        },
        _splitEmailAddresses: function(a, b) {
            for (var c = a.split(/"/), d = c.length, e = [], f = "", g = 0; d > g; g++)
                if (g % 2 === 0) {
                    var h = c[g].split(b),
                        i = h.length;
                    if (1 === i) f += h[0];
                    else {
                        e.push(f + h[0]);
                        for (var j = 1; i - 1 > j; j++) e.push(h[j]);
                        f = h[i - 1]
                    }
                } else f += '"' + c[g], d - 1 > g && (f += '"');
            return e.push(f), e
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            file: {
                "default": "Please choose a valid file"
            }
        }
    }), FormValidation.Validator.file = {
        Error: {
            EXTENSION: "EXTENSION",
            MAX_FILES: "MAX_FILES",
            MAX_SIZE: "MAX_SIZE",
            MAX_TOTAL_SIZE: "MAX_TOTAL_SIZE",
            MIN_FILES: "MIN_FILES",
            MIN_SIZE: "MIN_SIZE",
            MIN_TOTAL_SIZE: "MIN_TOTAL_SIZE",
            TYPE: "TYPE"
        },
        html5Attributes: {
            extension: "extension",
            maxfiles: "maxFiles",
            minfiles: "minFiles",
            maxsize: "maxSize",
            minsize: "minSize",
            maxtotalsize: "maxTotalSize",
            mintotalsize: "minTotalSize",
            message: "message",
            type: "type"
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            var g, h = d.extension ? d.extension.toLowerCase().split(",") : null,
                i = d.type ? d.type.toLowerCase().split(",") : null,
                j = window.File && window.FileList && window.FileReader;
            if (j) {
                var k = c.get(0).files,
                    l = k.length,
                    m = 0;
                if (d.maxFiles && l > parseInt(d.maxFiles, 10)) return {
                    valid: !1,
                    error: this.Error.MAX_FILES
                };
                if (d.minFiles && l < parseInt(d.minFiles, 10)) return {
                    valid: !1,
                    error: this.Error.MIN_FILES
                };
                for (var n = {}, o = 0; l > o; o++) {
                    if (m += k[o].size, g = k[o].name.substr(k[o].name.lastIndexOf(".") + 1), n = {
                            file: k[o],
                            size: k[o].size,
                            ext: g,
                            type: k[o].type
                        }, d.minSize && k[o].size < parseInt(d.minSize, 10)) return {
                        valid: !1,
                        error: this.Error.MIN_SIZE,
                        metaData: n
                    };
                    if (d.maxSize && k[o].size > parseInt(d.maxSize, 10)) return {
                        valid: !1,
                        error: this.Error.MAX_SIZE,
                        metaData: n
                    };
                    if (h && -1 === a.inArray(g.toLowerCase(), h)) return {
                        valid: !1,
                        error: this.Error.EXTENSION,
                        metaData: n
                    };
                    if (k[o].type && i && -1 === a.inArray(k[o].type.toLowerCase(), i)) return {
                        valid: !1,
                        error: this.Error.TYPE,
                        metaData: n
                    }
                }
                if (d.maxTotalSize && m > parseInt(d.maxTotalSize, 10)) return {
                    valid: !1,
                    error: this.Error.MAX_TOTAL_SIZE,
                    metaData: {
                        totalSize: m
                    }
                };
                if (d.minTotalSize && m < parseInt(d.minTotalSize, 10)) return {
                    valid: !1,
                    error: this.Error.MIN_TOTAL_SIZE,
                    metaData: {
                        totalSize: m
                    }
                }
            } else if (g = f.substr(f.lastIndexOf(".") + 1), h && -1 === a.inArray(g.toLowerCase(), h)) return {
                valid: !1,
                error: this.Error.EXTENSION,
                metaData: {
                    ext: g
                }
            };
            return !0
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            greaterThan: {
                "default": "Please enter a value greater than or equal to %s",
                notInclusive: "Please enter a value greater than %s"
            }
        }
    }), FormValidation.Validator.greaterThan = {
        html5Attributes: {
            message: "message",
            value: "value",
            inclusive: "inclusive"
        },
        enableByHtml5: function(a) {
            var b = a.attr("type"),
                c = a.attr("min");
            return c && "date" !== b ? {
                value: c
            } : !1
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            f = this._format(f);
            var g = b.getLocale(),
                h = a.isNumeric(d.value) ? d.value : b.getDynamicOption(c, d.value),
                i = this._format(h);
            return d.inclusive === !0 || void 0 === d.inclusive ? {
                valid: a.isNumeric(f) && parseFloat(f) >= i,
                message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].greaterThan["default"], h)
            } : {
                valid: a.isNumeric(f) && parseFloat(f) > i,
                message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].greaterThan.notInclusive, h)
            }
        },
        _format: function(a) {
            return (a + "").replace(",", ".")
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            identical: {
                "default": "Please enter the same value"
            }
        }
    }), FormValidation.Validator.identical = {
        html5Attributes: {
            message: "message",
            field: "field"
        },
        init: function(a, b, c, d) {
            var e = a.getFieldElements(c.field);
            a.onLiveChange(e, "live_" + d, function() {
                var c = a.getStatus(b, d);
                c !== a.STATUS_NOT_VALIDATED && a.revalidateField(b)
            })
        },
        destroy: function(a, b, c, d) {
            var e = a.getFieldElements(c.field);
            a.offLiveChange(e, "live_" + d)
        },
        validate: function(a, b, c, d) {
            var e = a.getFieldValue(b, d),
                f = a.getFieldElements(c.field);
            if (null === f || 0 === f.length) return !0;
            var g = a.getFieldValue(f, d);
            return e === g ? (a.updateStatus(f, a.STATUS_VALID, d), !0) : !1
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            integer: {
                "default": "Please enter a valid number"
            }
        }
    }), FormValidation.Validator.integer = {
        html5Attributes: {
            message: "message",
            thousandsseparator: "thousandsSeparator",
            decimalseparator: "decimalSeparator"
        },
        enableByHtml5: function(a) {
            return "number" === a.attr("type") && (void 0 === a.attr("step") || a.attr("step") % 1 === 0)
        },
        validate: function(a, b, c, d) {
            if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0) return !1;
            var e = a.getFieldValue(b, d);
            if ("" === e) return !0;
            var f = c.decimalSeparator || ".",
                g = c.thousandsSeparator || "";
            f = "." === f ? "\\." : f, g = "." === g ? "\\." : g;
            var h = new RegExp("^-?[0-9]{1,3}(" + g + "[0-9]{3})*(" + f + "[0-9]+)?$"),
                i = new RegExp(g, "g");
            return h.test(e) ? (g && (e = e.replace(i, "")), f && (e = e.replace(f, ".")), isNaN(e) || !isFinite(e) ? !1 : (e = parseFloat(e), Math.floor(e) === e)) : !1
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            lessThan: {
                "default": "Please enter a value less than or equal to %s",
                notInclusive: "Please enter a value less than %s"
            }
        }
    }), FormValidation.Validator.lessThan = {
        html5Attributes: {
            message: "message",
            value: "value",
            inclusive: "inclusive"
        },
        enableByHtml5: function(a) {
            var b = a.attr("type"),
                c = a.attr("max");
            return c && "date" !== b ? {
                value: c
            } : !1
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ("" === f) return !0;
            f = this._format(f);
            var g = b.getLocale(),
                h = a.isNumeric(d.value) ? d.value : b.getDynamicOption(c, d.value),
                i = this._format(h);
            return d.inclusive === !0 || void 0 === d.inclusive ? {
                valid: a.isNumeric(f) && parseFloat(f) <= i,
                message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].lessThan["default"], h)
            } : {
                valid: a.isNumeric(f) && parseFloat(f) < i,
                message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].lessThan.notInclusive, h)
            }
        },
        _format: function(a) {
            return (a + "").replace(",", ".")
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            notEmpty: {
                "default": "Please enter a value"
            }
        }
    }), FormValidation.Validator.notEmpty = {
        enableByHtml5: function(a) {
            var b = a.attr("required") + "";
            return "required" === b || "true" === b
        },
        validate: function(b, c, d, e) {
            var f = c.attr("type");
            if ("radio" === f || "checkbox" === f) {
                var g = b.getNamespace();
                return b.getFieldElements(c.attr("data-" + g + "-field")).filter(":checked").length > 0
            }
            if ("number" === f && c.get(0).validity && c.get(0).validity.badInput === !0) return !0;
            var h = b.getFieldValue(c, e);
            return "" !== a.trim(h)
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            numeric: {
                "default": "Please enter a valid float number"
            }
        }
    }), FormValidation.Validator.numeric = {
        html5Attributes: {
            message: "message",
            separator: "separator",
            thousandsseparator: "thousandsSeparator",
            decimalseparator: "decimalSeparator"
        },
        enableByHtml5: function(a) {
            return "number" === a.attr("type") && void 0 !== a.attr("step") && a.attr("step") % 1 !== 0
        },
        validate: function(a, b, c, d) {
            if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0) return !1;
            var e = a.getFieldValue(b, d);
            if ("" === e) return !0;
            var f = c.separator || c.decimalSeparator || ".",
                g = c.thousandsSeparator || "";
            e.substr(0, 1) === f ? e = "0" + f + e.substr(1) : e.substr(0, 2) === "-" + f && (e = "-0" + f + e.substr(2)), f = "." === f ? "\\." : f, g = "." === g ? "\\." : g;
            var h = new RegExp("^-?[0-9]{1,3}(" + g + "[0-9]{3})*(" + f + "[0-9]+)?$"),
                i = new RegExp(g, "g");
            return h.test(e) ? (g && (e = e.replace(i, "")), f && (e = e.replace(f, ".")), !isNaN(parseFloat(e)) && isFinite(e)) : !1
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            promise: {
                "default": "Please enter a valid value"
            }
        }
    }), FormValidation.Validator.promise = {
        priority: 999,
        html5Attributes: {
            message: "message",
            promise: "promise"
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e),
                g = new a.Deferred,
                h = FormValidation.Helper.call(d.promise, [f, b, c]);
            return h.done(function(a) {
                g.resolve(c, e, a)
            }).fail(function(a) {
                a = a || {}, a.valid = !1, g.resolve(c, e, a)
            }), g
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            regexp: {
                "default": "Please enter a value matching the pattern"
            }
        }
    }), FormValidation.Validator.regexp = {
        html5Attributes: {
            message: "message",
            flags: "flags",
            regexp: "regexp"
        },
        enableByHtml5: function(a) {
            var b = a.attr("pattern");
            return b ? {
                regexp: b
            } : !1
        },
        validate: function(a, b, c, d) {
            var e = a.getFieldValue(b, d);
            if ("" === e) return !0;
            var f = "string" == typeof c.regexp ? c.flags ? new RegExp(c.regexp, c.flags) : new RegExp(c.regexp) : c.regexp;
            return f.test(e)
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            remote: {
                "default": "Please enter a valid value"
            }
        }
    }), FormValidation.Validator.remote = {
        priority: 1e3,
        html5Attributes: {
            async: "async",
            crossdomain: "crossDomain",
            data: "data",
            datatype: "dataType",
            delay: "delay",
            message: "message",
            name: "name",
            type: "type",
            url: "url",
            validkey: "validKey"
        },
        destroy: function(a, b, c, d) {
            var e = a.getNamespace(),
                f = b.data(e + "." + d + ".timer");
            f && (clearTimeout(f), b.removeData(e + "." + d + ".timer"))
        },
        validate: function(b, c, d, e) {
            function f() {
                var b = a.ajax(n);
                return b.success(function(a) {
                    a.valid = a[m] === !0 || "true" === a[m] ? !0 : a[m] === !1 || "false" === a[m] ? !1 : null, i.resolve(c, e, a)
                }).error(function(a) {
                    i.resolve(c, e, {
                        valid: !1
                    })
                }), i.fail(function() {
                    b.abort()
                }), i
            }
            var g = b.getNamespace(),
                h = b.getFieldValue(c, e),
                i = new a.Deferred;
            if ("" === h) return i.resolve(c, e, {
                valid: !0
            }), i;
            var j = c.attr("data-" + g + "-field"),
                k = d.data || {},
                l = d.url,
                m = d.validKey || "valid";
            "function" == typeof k && (k = k.call(this, b, c, h)), "string" == typeof k && (k = JSON.parse(k)), "function" == typeof l && (l = l.call(this, b, c, h)), k[d.name || j] = h;
            var n = {
                async: null === d.async || d.async === !0 || "true" === d.async,
                data: k,
                dataType: d.dataType || "json",
                headers: d.headers || {},
                type: d.type || "GET",
                url: l
            };
            return null !== d.crossDomain && (n.crossDomain = d.crossDomain === !0 || "true" === d.crossDomain), d.delay ? (c.data(g + "." + e + ".timer") && clearTimeout(c.data(g + "." + e + ".timer")), c.data(g + "." + e + ".timer", setTimeout(f, d.delay)), i) : f()
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            stringLength: {
                "default": "Please enter a value with valid length",
                less: "Please enter less than %s characters",
                more: "Please enter more than %s characters",
                between: "Please enter value between %s and %s characters long"
            }
        }
    }), FormValidation.Validator.stringLength = {
        html5Attributes: {
            message: "message",
            min: "min",
            max: "max",
            trim: "trim",
            utf8bytes: "utf8Bytes"
        },
        enableByHtml5: function(b) {
            var c = {},
                d = b.attr("maxlength"),
                e = b.attr("minlength");
            return d && (c.max = parseInt(d, 10)), e && (c.min = parseInt(e, 10)), a.isEmptyObject(c) ? !1 : c
        },
        validate: function(b, c, d, e) {
            var f = b.getFieldValue(c, e);
            if ((d.trim === !0 || "true" === d.trim) && (f = a.trim(f)), "" === f) return !0;
            var g = b.getLocale(),
                h = a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min),
                i = a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max),
                j = function(a) {
                    for (var b = a.length, c = a.length - 1; c >= 0; c--) {
                        var d = a.charCodeAt(c);
                        d > 127 && 2047 >= d ? b++ : d > 2047 && 65535 >= d && (b += 2), d >= 56320 && 57343 >= d && c--
                    }
                    return b
                },
                k = d.utf8Bytes ? j(f) : f.length,
                l = !0,
                m = d.message || FormValidation.I18n[g].stringLength["default"];
            switch ((h && k < parseInt(h, 10) || i && k > parseInt(i, 10)) && (l = !1), !0) {
                case !!h && !!i:
                    m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.between, [parseInt(h, 10), parseInt(i, 10)]);
                    break;
                case !!h:
                    m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.more, parseInt(h, 10) - 1);
                    break;
                case !!i:
                    m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.less, parseInt(i, 10) + 1)
            }
            return {
                valid: l,
                message: m
            }
        }
    }
}(jQuery),
function(a) {
    FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
        en_US: {
            uri: {
                "default": "Please enter a valid URI"
            }
        }
    }), FormValidation.Validator.uri = {
        html5Attributes: {
            message: "message",
            allowlocal: "allowLocal",
            allowemptyprotocol: "allowEmptyProtocol",
            protocol: "protocol"
        },
        enableByHtml5: function(a) {
            return "url" === a.attr("type")
        },
        validate: function(a, b, c, d) {
            var e = a.getFieldValue(b, d);
            if ("" === e) return !0;
            var f = c.allowLocal === !0 || "true" === c.allowLocal,
                g = c.allowEmptyProtocol === !0 || "true" === c.allowEmptyProtocol,
                h = (c.protocol || "http, https, ftp").split(",").join("|").replace(/\s/g, ""),
                i = new RegExp("^(?:(?:" + h + ")://)" + (g ? "?" : "") + "(?:\\S+(?::\\S*)?@)?(?:" + (f ? "" : "(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})") + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9])*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + (f ? "?" : "") + ")(?::\\d{2,5})?(?:/[^\\s]*)?$", "i");
            return i.test(e)
        }
    }
}(jQuery);