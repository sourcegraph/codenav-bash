var Module = void 0 !== Module ? Module : {};
!function(e, t) {
  "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : window.TreeSitter = t()
}(0, function() {
  var e,
    t = {};
  for (e in Module) Module.hasOwnProperty(e) && (t[e] = Module[e]);
  var r,
    n,
    o = [],
    s = function(e, t) {
      throw t
    },
    _ = !1,
    a = !1;
  _ = "object" == typeof window, a = "function" == typeof importScripts, r = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, n = !_ && !r && !a;
  var u,
    i,
    l,
    d,
    c = "";
  r ? (c = a ? require("path").dirname(c) + "/" : __dirname + "/", u = function(e, t) {
    return l || (l = require("fs")), d || (d = require("path")), e = d.normalize(e), l.readFileSync(e, t ? null : "utf8")
  }, i = function(e) {
    var t = u(e, !0);
    return t.buffer || (t = new Uint8Array(t)), q(t.buffer), t
  }, process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), o = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), process.on("uncaughtException", function(e) {
    if (!(e instanceof Ze))
      throw e
  }), process.on("unhandledRejection", de), s = function(e) {
    process.exit(e)
  }, Module.inspect = function() {
    return "[Emscripten Module object]"
  }) : n ? ("undefined" != typeof read && (u = function(e) {
    return read(e)
  }), i = function(e) {
    var t;
    return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (q("object" == typeof (t = read(e, "binary"))), t)
  }, "undefined" != typeof scriptArgs ? o = scriptArgs : void 0 !== arguments && (o = arguments), "function" == typeof quit && (s = function(e) {
    quit(e)
  }), "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (_ || a) && (a ? c = self.location.href : document.currentScript && (c = document.currentScript.src), c = 0 !== c.indexOf("blob:") ? c.substr(0, c.lastIndexOf("/") + 1) : "", u = function(e) {
    var t = new XMLHttpRequest;
    return t.open("GET", e, !1), t.send(null), t.responseText
  }, a && (i = function(e) {
    var t = new XMLHttpRequest;
    return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response)
  }), function(e, t, r) {
    var n = new XMLHttpRequest;
    n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = function() {
      200 == n.status || 0 == n.status && n.response ? t(n.response) : r()
    }, n.onerror = r, n.send(null)
  });
  var m = Module.print || console.log.bind(console),
    f = Module.printErr || console.warn.bind(console);
  for (e in t) t.hasOwnProperty(e) && (Module[e] = t[e]);
  t = null, Module.arguments && (o = Module.arguments), Module.thisProgram && Module.thisProgram, Module.quit && (s = Module.quit);
  var p = 16;
  function h(e) {
    var t = D[K >> 2],
      r = t + e + 15 & -16;
    return r > Ee() && de(), D[K >> 2] = r, t
  }
  function w(e, t) {
    return t || (t = p), Math.ceil(e / t) * t
  }
  function g(e) {
    switch (e) {
      case "i1":
      case "i8":
        return 1;case "i16":
        return 2;case "i32":
        return 4;case "i64":
        return 8;case "float":
        return 4;case "double":
        return 8;default:
        if ("*" === e[e.length - 1]) return 4;
        if ("i" === e[0]) {
          var t = parseInt(e.substr(1));
          return q(t % 8 == 0, "getNativeTypeSize invalid bits " + t + ", type " + e), t / 8
        }
        return 0
    }
  }
  var M = {
    nextHandle: 1,
    loadedLibs: {
      "-1": {
        refcount: 1 / 0,
        name: "__self__",
        module: Module,
        global: !0
      }
    },
    loadedLibNames: {
      __self__: -1
    }
  };
  function y(e, t) {
    t = t || {
      global: !0,
      nodelete: !0
    };var r,
      n = M.loadedLibNames[e];
    if (n) return r = M.loadedLibs[n], t.global && !r.global && (r.global = !0, "loading" !== r.module && a(r.module)), t.nodelete && r.refcount !== 1 / 0 && (r.refcount = 1 / 0), r.refcount++, t.loadAsync ? Promise.resolve(n) : n;
    function o() {
      if (t.fs) {
        var r = t.fs.readFile(e, {
          encoding: "binary"
        });
        return r instanceof Uint8Array || (r = new Uint8Array(lib_data)), t.loadAsync ? Promise.resolve(r) : r
      }
      return t.loadAsync ? (n = e, fetch(n, {
        credentials: "same-origin"
      }).then(function(e) {
        if (!e.ok)
          throw "failed to load binary file at '" + n + "'";
        return e.arrayBuffer()
      }).then(function(e) {
        return new Uint8Array(e)
      })) : i(e);var n
    }
    function s(e) {
      return E(e, t)
    }
    function _() {
      if (void 0 !== Module.preloadedWasm && void 0 !== Module.preloadedWasm[e]) {
        var r = Module.preloadedWasm[e];
        return t.loadAsync ? Promise.resolve(r) : r
      }
      return t.loadAsync ? o().then(function(e) {
        return s(e)
      }) : s(o())
    }
    function a(e) {
      for (var t in e)
        if (e.hasOwnProperty(t)) {
          var r;
          r = "_" + t, Module.hasOwnProperty(r) || (Module[r] = e[t])
      }
    }
    function u(e) {
      r.global && a(e), r.module = e
    }
    return n = M.nextHandle++, r = {
        refcount: t.nodelete ? 1 / 0 : 1,
        name: e,
        module: "loading",
        global: t.global
      }, M.loadedLibNames[e] = n, M.loadedLibs[n] = r, t.loadAsync ? _().then(function(e) {
        return u(e), n
      }) : (u(_()), n)
  }
  function b(e, t, r, n) {
    var o = {};
    for (var s in e) {
      var _ = e[s];
      "object" == typeof _ && (_ = _.value), "number" == typeof _ && (_ += t), o[s] = _, n && (n["_" + s] = _)
    }
    return o
  }
  function E(e, t) {
    q(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0], "need to see wasm magic number"), q(0 === e[8], "need the dylink section to be first");var r = 9;
    function n() {
      for (var t = 0, n = 1;;) {
        var o = e[r++];
        if (t += (127 & o) * n, n *= 128, !(128 & o)) break
      }
      return t
    }
    n();q(6 === e[r]), q(e[++r] === "d".charCodeAt(0)), q(e[++r] === "y".charCodeAt(0)), q(e[++r] === "l".charCodeAt(0)), q(e[++r] === "i".charCodeAt(0)), q(e[++r] === "n".charCodeAt(0)), q(e[++r] === "k".charCodeAt(0)), r++;
    for (var o = n(), s = n(), _ = n(), a = n(), u = n(), i = [], l = 0; l < u; ++l) {
      var d = n(),
        c = e.subarray(r, r + d);
      r += d;var m = $(c, 0);
      i.push(m)
    }
    function f() {
      s = Math.pow(2, s), a = Math.pow(2, a), s = Math.max(s, p);
      for (var r = w(F(o + s), s), n = r; n < r + o; ++n) O[n] = 0;
      var u = Ne,
        i = R,
        l = i.length,
        d = i;
      i.grow(_), q(i === d);
      for (n = r; n < r + o; n++) O[n] = 0;
      for (n = l; n < l + _; n++) i.set(n, null);
      var c = {},
        m = function(e, t, r) {
          r && (e = "orig$" + e);
          var n = Module.asm[e];
          return n || (n = Module[e = "_" + e]) || (n = c[e]), n
        };
      for (var f in Module) f in u || (u[f] = Module[f]);
      var h = new Proxy(u, {
          get: function(e, t) {
            switch (t) {
              case "__memory_base":
              case "gb":
                return r;case "__table_base":
              case "fb":
                return l
            }
            if (t in e) return e[t];
            if (t.startsWith("g$")) {
              var n = t.substr(2);
              return e[t] = function() {
                return m(n)
              }
            }
            if (t.startsWith("fp$")) {
              var o = t.split("$");
              q(3 == o.length);
              n = o[1];
              var s = o[2],
                _ = s.indexOf("j") >= 0,
                a = 0;
              return e[t] = function() {
                if (!a) {
                  var e = m(n, 0, _);
                  a = I(e, s)
                }
                return a
              }
            }
            return t.startsWith("invoke_") ? e[t] = We : e[t] = function() {
              return m(t).apply(null, arguments)
            }
          }
        }),
        g = {
          global: {
            NaN: NaN,
            Infinity: 1 / 0
          },
          "global.Math": Math,
          env: h,
          wasi_snapshot_preview1: h
        };
      function M(e, t) {
        var n = b(e.exports, r, 0, t),
          o = n.__post_instantiate;
        return o && (ee ? o() : Q.push(o)), n
      }
      return t.loadAsync ? WebAssembly.instantiate(e, g).then(function(e) {
        return M(e.instance, c)
      }) : M(new WebAssembly.Instance(new WebAssembly.Module(e), g), c)
    }
    return t.loadAsync ? Promise.all(i.map(function(e) {
      return y(e, t)
    })).then(function() {
      return f()
    }) : (i.forEach(function(e) {
      y(e, t)
    }), f())
  }
  function v(e, t) {
    var r = R,
      n = r.length;
    try {
      r.grow(1)
    } catch (e) {
      if (!(e instanceof RangeError))
        throw e;
      throw "Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH."
    } try {
      r.set(n, e)
    } catch (s) {
      if (!(s instanceof TypeError))
        throw s;
      q(void 0 !== t, "Missing signature argument to addFunction");var o = function(e, t) {
        if ("function" == typeof WebAssembly.Function) {
          for (var r = {
                i: "i32",
                j: "i64",
                f: "f32",
                d: "f64"
              }, n = {
                parameters: [],
                results: "v" == t[0] ? [] : [r[t[0]]]
              }, o = 1; o < t.length; ++o) n.parameters.push(r[t[o]]);
          return new WebAssembly.Function(n, e)
        }
        var s = [1, 0, 1, 96],
          _ = t.slice(0, 1),
          a = t.slice(1),
          u = {
            i: 127,
            j: 126,
            f: 125,
            d: 124
          };
        for (s.push(a.length), o = 0; o < a.length; ++o) s.push(u[a[o]]);
        "v" == _ ? s.push(0) : s = s.concat([1, u[_]]), s[1] = s.length - 2;
        var i = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(s, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])),
          l = new WebAssembly.Module(i);
        return new WebAssembly.Instance(l, {
          e: {
            f: e
          }
        }).exports.f
      }(e, t);
      r.set(n, o)
    } return n
  }
  function I(e, t) {
    return v(e, t)
  }
  Module.loadWebAssemblyModule = E;
  var S,
    N,
    x,
    A = 1024;
  function k(e, t, r, n) {
    switch ("*" === (r = r || "i8").charAt(r.length - 1) && (r = "i32"), r) {
      case "i1":
      case "i8":
        O[e >> 0] = t;
        break;case "i16":
        j[e >> 1] = t;
        break;case "i32":
        D[e >> 2] = t;
        break;case "i64":
        he = [t >>> 0,(pe = t, +re(pe) >= 1 ? pe > 0 ? (0 | se(+oe(pe / 4294967296), 4294967295)) >>> 0 : ~~+ne((pe - +(~~pe >>> 0)) / 4294967296) >>> 0 : 0)], D[e >> 2] = he[0], D[e + 4 >> 2] = he[1];
        break;case "float":
        B[e >> 2] = t;
        break;case "double":
        H[e >> 3] = t;
        break;default:
        de("invalid type for setValue: " + r)
    }
  }
  function P(e, t, r) {
    switch ("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t) {
      case "i1":
      case "i8":
        return O[e >> 0];case "i16":
        return j[e >> 1];case "i32":
      case "i64":
        return D[e >> 2];case "float":
        return B[e >> 2];case "double":
        return H[e >> 3];default:
        de("invalid type for getValue: " + t)
    }
    return null
  }
  A = w(A, 1), Module.wasmBinary && (S = Module.wasmBinary), Module.noExitRuntime && (N = Module.noExitRuntime), "object" != typeof WebAssembly && f("no native wasm support detected");
  var R = new WebAssembly.Table({
      initial: 12,
      element: "anyfunc"
    }),
    C = !1;
  function q(e, t) {
    e || de("Assertion failed: " + t)
  }
  var T = 3;
  function F(e) {
    return ee ? Pe(e) : h(e)
  }
  var L = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
  function $(e, t, r) {
    for (var n = t + r, o = t; e[o] && !(o >= n);) ++o;
    if (o - t > 16 && e.subarray && L) return L.decode(e.subarray(t, o));
    for (var s = ""; t < o;) {
      var _ = e[t++];
      if (128 & _) {
        var a = 63 & e[t++];
        if (192 != (224 & _)) {
          var u = 63 & e[t++];
          if ((_ = 224 == (240 & _) ? (15 & _) << 12 | a << 6 | u : (7 & _) << 18 | a << 12 | u << 6 | 63 & e[t++]) < 65536)
            s += String.fromCharCode(_);
          else {
            var i = _ - 65536;
            s += String.fromCharCode(55296 | i >> 10, 56320 | 1023 & i)
          }
        } else
          s += String.fromCharCode((31 & _) << 6 | a)
      } else
        s += String.fromCharCode(_)
    }
    return s
  }
  function W(e, t) {
    return e ? $(U, e, t) : ""
  }
  "undefined" != typeof TextDecoder && new TextDecoder("utf-16le");
  var Z,
    O,
    U,
    j,
    D,
    B,
    H;
  function z(e) {
    Z = e, Module.HEAP8 = O = new Int8Array(e), Module.HEAP16 = j = new Int16Array(e), Module.HEAP32 = D = new Int32Array(e), Module.HEAPU8 = U = new Uint8Array(e), Module.HEAPU16 = new Uint16Array(e), Module.HEAPU32 = new Uint32Array(e), Module.HEAPF32 = B = new Float32Array(e), Module.HEAPF64 = H = new Float64Array(e)
  }
  var K = 7984,
    G = Module.TOTAL_MEMORY || 33554432;
  function V(e) {
    for (; e.length > 0;) {
      var t = e.shift();
      if ("function" != typeof t) {
        var r = t.func;
        "number" == typeof r ? void 0 === t.arg ? Module.dynCall_v(r) : Module.dynCall_vi(r, t.arg) : r(void 0 === t.arg ? null : t.arg)
      } else t()
    }
  }
  (x = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({
    initial: G / 65536
  })) && (Z = x.buffer), G = Z.byteLength, z(Z), D[K >> 2] = 5251024;
  var X = [],
    Q = [],
    Y = [],
    J = [],
    ee = !1;
  function te(e) {
    X.unshift(e)
  }
  var re = Math.abs,
    ne = Math.ceil,
    oe = Math.floor,
    se = Math.min,
    _e = 0,
    ae = null,
    ue = null;
  function ie(e) {
    _e++, Module.monitorRunDependencies && Module.monitorRunDependencies(_e)
  }
  function le(e) {
    if (_e--, Module.monitorRunDependencies && Module.monitorRunDependencies(_e), 0 == _e && (null !== ae && (clearInterval(ae), ae = null), ue)) {
      var t = ue;
      ue = null, t()
    }
  }
  function de(e) {
    throw Module.onAbort && Module.onAbort(e), m(e += ""), f(e), C = !0, 1, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e)
  }
  Module.preloadedImages = {}, Module.preloadedAudios = {}, Module.preloadedWasm = {}, te(function() {
    if (Module.dynamicLibraries && Module.dynamicLibraries.length > 0 && !i) return ie(), void Promise.all(Module.dynamicLibraries.map(function(e) {
          return y(e, {
            loadAsync: !0,
            global: !0,
            nodelete: !0
          })
        })).then(function() {
          le()
        });
    var e;
    (e = Module.dynamicLibraries) && e.forEach(function(e) {
      y(e, {
        global: !0,
        nodelete: !0
      })
    })
  });
  var ce = "data:application/octet-stream;base64,";
  function me(e) {
    return String.prototype.startsWith ? e.startsWith(ce) : 0 === e.indexOf(ce)
  }
  var fe,
    pe,
    he,
    we = "https://storage.googleapis.com/tree-sitter/tree-sitter.wasm";
  function ge() {
    try {
      if (S) return new Uint8Array(S);
      if (i) return i(we);
      throw "both async and sync fetching of the wasm failed"
    } catch (e) {
      de(e)
    }
  }
  function Me() {
    de()
  }
  function ye() {
    de()
  }
  me(we) || (fe = we, we = Module.locateFile ? Module.locateFile(fe, c) : c + fe), Q.push({
    func: function() {
      Fe()
    }
  }, {
    func: function() {
      ke()
    }
  }), Module._abort = Me;
  var be = r || "undefined" != typeof dateNow || 1;
  function Ee() {
    return U.length
  }
  function ve(e) {
    try {
      return x.grow(e - Z.byteLength + 65535 >> 16), z(x.buffer), 1
    } catch (e) {}
  }
  function Ie(e, t, r) {
    if (ot) {
      const e = W(r);
      ot(e, 0 !== t)
    }
  }
  ye = r ? function() {
    var e = process.hrtime();
    return 1e3 * e[0] + e[1] / 1e6
  } : "undefined" != typeof dateNow ? dateNow : function() {
    return performance.now()
  };
  var Se = A,
    Ne = {
      __memory_base: 1024,
      __stack_pointer: 5251024,
      __table_base: 1,
      abort: Me,
      clock_gettime: function(e, t) {
        var r,
          n;
        if (0 === e)
          r = Date.now();
        else {
          if (1 !== e && 4 !== e || !be) return n = 28, Module.___errno_location && (D[Module.___errno_location() >> 2] = n), -1;
          r = ye()
        }
        return D[t >> 2] = r / 1e3 | 0, D[t + 4 >> 2] = r % 1e3 * 1e3 * 1e3 | 0, 0
      },
      emscripten_memcpy_big: function(e, t, r) {
        U.set(U.subarray(t, t + r), e)
      },
      emscripten_resize_heap: function(e) {
        var t = Ee();
        if (e > 2147418112) return !1;
        for (var r, n, o = 1; o <= 4; o *= 2) {
          var s = t * (1 + .2 / o);
          if (s = Math.min(s, e + 100663296), ve(Math.min(2147418112, ((r = Math.max(16777216, e, s)) % (n = 65536) > 0 && (r += n - r % n), r)))) return !0
        }
        return !1
      },
      exit: function(e) {
        Ue(e)
      },
      fp$tree_sitter_log_callback$viii: function() {
        return Module._fp$tree_sitter_log_callback$viii.apply(null, arguments)
      },
      g$TRANSFER_BUFFER: function() {
        return Module._TRANSFER_BUFFER
      },
      g$__THREW__: function() {
        return Module.___THREW__
      },
      g$__cxa_new_handler: function() {
        return Module.___cxa_new_handler
      },
      g$__threwValue: function() {
        return Module.___threwValue
      },
      memory: x,
      table: R,
      tree_sitter_parse_callback: function(e, t, r, n, o) {
        var s = nt(t, {
          row: r,
          column: n
        });
        "string" == typeof s ? (k(o, s.length, "i32"), function(e, t, r) {
          if (void 0 === r && (r = 2147483647), r < 2) return 0;
          for (var n = (r -= 2) < 2 * e.length ? r / 2 : e.length, o = 0; o < n; ++o) {
            var s = e.charCodeAt(o);
            j[t >> 1] = s, t += 2
          }
          j[t >> 1] = 0
        }(s, e, 10240)) : k(o, 0, "i32")
      }
    },
    xe = function() {
      var e = {
        env: Ne,
        wasi_snapshot_preview1: Ne
      };
      function t(e, t) {
        var r = e.exports;
        r = b(r, A), Module.asm = r, le()
      }
      function r(e) {
        t(e.instance)
      }
      function n(t) {
        return (S || !_ && !a || "function" != typeof fetch ? new Promise(function(e, t) {
          e(ge())
        }) : fetch(we, {
          credentials: "same-origin"
        }).then(function(e) {
          if (!e.ok)
            throw "failed to load wasm binary file at '" + we + "'";
          return e.arrayBuffer()
        }).catch(function() {
          return ge()
        })).then(function(t) {
          return WebAssembly.instantiate(t, e)
        }).then(t, function(e) {
          f("failed to asynchronously prepare wasm: " + e), de(e)
        })
      }
      if (ie(), Module.instantiateWasm) try {
          return Module.instantiateWasm(e, t)
        } catch (e) {
          return f("Module.instantiateWasm callback failed with error: " + e), !1
      } return function() {
          if (S || "function" != typeof WebAssembly.instantiateStreaming || me(we) || "function" != typeof fetch) return n(r);
          fetch(we, {
            credentials: "same-origin"
          }).then(function(t) {
            return WebAssembly.instantiateStreaming(t, e).then(r, function(e) {
              f("wasm streaming compile failed: " + e), f("falling back to ArrayBuffer instantiation"), n(r)
            })
          })
        }(), {}
    }();
  Module.asm = xe;
  var Ae,
    ke = Module.___wasm_call_ctors = function() {
      return (ke = Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments)
    },
    Pe = (Module._calloc = function() {
      return (Module._calloc = Module.asm.calloc).apply(null, arguments)
    }, Module._ts_language_symbol_count = function() {
      return (Module._ts_language_symbol_count = Module.asm.ts_language_symbol_count).apply(null, arguments)
    }, Module._ts_language_version = function() {
      return (Module._ts_language_version = Module.asm.ts_language_version).apply(null, arguments)
    }, Module._ts_language_field_count = function() {
      return (Module._ts_language_field_count = Module.asm.ts_language_field_count).apply(null, arguments)
    }, Module._ts_language_symbol_name = function() {
      return (Module._ts_language_symbol_name = Module.asm.ts_language_symbol_name).apply(null, arguments)
    }, Module._ts_language_symbol_type = function() {
      return (Module._ts_language_symbol_type = Module.asm.ts_language_symbol_type).apply(null, arguments)
    }, Module._ts_language_field_name_for_id = function() {
      return (Module._ts_language_field_name_for_id = Module.asm.ts_language_field_name_for_id).apply(null, arguments)
    }, Module._memcpy = function() {
      return (Module._memcpy = Module.asm.memcpy).apply(null, arguments)
    }, Module._free = function() {
      return (Module._free = Module.asm.free).apply(null, arguments)
    }, Module._malloc = function() {
      return (Pe = Module._malloc = Module.asm.malloc).apply(null, arguments)
    }),
    Re = (Module._ts_parser_delete = function() {
      return (Module._ts_parser_delete = Module.asm.ts_parser_delete).apply(null, arguments)
    }, Module._ts_parser_set_language = function() {
      return (Module._ts_parser_set_language = Module.asm.ts_parser_set_language).apply(null, arguments)
    }, Module._memcmp = function() {
      return (Module._memcmp = Module.asm.memcmp).apply(null, arguments)
    }, Module._ts_query_new = function() {
      return (Module._ts_query_new = Module.asm.ts_query_new).apply(null, arguments)
    }, Module._iswspace = function() {
      return (Module._iswspace = Module.asm.iswspace).apply(null, arguments)
    }, Module._ts_query_delete = function() {
      return (Module._ts_query_delete = Module.asm.ts_query_delete).apply(null, arguments)
    }, Module._iswalnum = function() {
      return (Module._iswalnum = Module.asm.iswalnum).apply(null, arguments)
    }, Module._ts_query_pattern_count = function() {
      return (Module._ts_query_pattern_count = Module.asm.ts_query_pattern_count).apply(null, arguments)
    }, Module._ts_query_capture_count = function() {
      return (Module._ts_query_capture_count = Module.asm.ts_query_capture_count).apply(null, arguments)
    }, Module._ts_query_string_count = function() {
      return (Module._ts_query_string_count = Module.asm.ts_query_string_count).apply(null, arguments)
    }, Module._ts_query_capture_name_for_id = function() {
      return (Module._ts_query_capture_name_for_id = Module.asm.ts_query_capture_name_for_id).apply(null, arguments)
    }, Module._ts_query_string_value_for_id = function() {
      return (Module._ts_query_string_value_for_id = Module.asm.ts_query_string_value_for_id).apply(null, arguments)
    }, Module._ts_query_predicates_for_pattern = function() {
      return (Module._ts_query_predicates_for_pattern = Module.asm.ts_query_predicates_for_pattern).apply(null, arguments)
    }, Module._ts_tree_delete = function() {
      return (Module._ts_tree_delete = Module.asm.ts_tree_delete).apply(null, arguments)
    }, Module._ts_init = function() {
      return (Module._ts_init = Module.asm.ts_init).apply(null, arguments)
    }, Module._ts_parser_new_wasm = function() {
      return (Module._ts_parser_new_wasm = Module.asm.ts_parser_new_wasm).apply(null, arguments)
    }, Module._ts_parser_enable_logger_wasm = function() {
      return (Module._ts_parser_enable_logger_wasm = Module.asm.ts_parser_enable_logger_wasm).apply(null, arguments)
    }, Module._ts_parser_parse_wasm = function() {
      return (Module._ts_parser_parse_wasm = Module.asm.ts_parser_parse_wasm).apply(null, arguments)
    }, Module._ts_tree_root_node_wasm = function() {
      return (Module._ts_tree_root_node_wasm = Module.asm.ts_tree_root_node_wasm).apply(null, arguments)
    }, Module._ts_tree_edit_wasm = function() {
      return (Module._ts_tree_edit_wasm = Module.asm.ts_tree_edit_wasm).apply(null, arguments)
    }, Module._ts_tree_get_changed_ranges_wasm = function() {
      return (Module._ts_tree_get_changed_ranges_wasm = Module.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_new_wasm = function() {
      return (Module._ts_tree_cursor_new_wasm = Module.asm.ts_tree_cursor_new_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_delete_wasm = function() {
      return (Module._ts_tree_cursor_delete_wasm = Module.asm.ts_tree_cursor_delete_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_reset_wasm = function() {
      return (Module._ts_tree_cursor_reset_wasm = Module.asm.ts_tree_cursor_reset_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_goto_first_child_wasm = function() {
      return (Module._ts_tree_cursor_goto_first_child_wasm = Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_goto_next_sibling_wasm = function() {
      return (Module._ts_tree_cursor_goto_next_sibling_wasm = Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_goto_parent_wasm = function() {
      return (Module._ts_tree_cursor_goto_parent_wasm = Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_current_node_type_id_wasm = function() {
      return (Module._ts_tree_cursor_current_node_type_id_wasm = Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_current_node_is_named_wasm = function() {
      return (Module._ts_tree_cursor_current_node_is_named_wasm = Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_current_node_is_missing_wasm = function() {
      return (Module._ts_tree_cursor_current_node_is_missing_wasm = Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_current_node_id_wasm = function() {
      return (Module._ts_tree_cursor_current_node_id_wasm = Module.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_start_position_wasm = function() {
      return (Module._ts_tree_cursor_start_position_wasm = Module.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_end_position_wasm = function() {
      return (Module._ts_tree_cursor_end_position_wasm = Module.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_start_index_wasm = function() {
      return (Module._ts_tree_cursor_start_index_wasm = Module.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_end_index_wasm = function() {
      return (Module._ts_tree_cursor_end_index_wasm = Module.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_current_field_id_wasm = function() {
      return (Module._ts_tree_cursor_current_field_id_wasm = Module.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments)
    }, Module._ts_tree_cursor_current_node_wasm = function() {
      return (Module._ts_tree_cursor_current_node_wasm = Module.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments)
    }, Module._ts_node_symbol_wasm = function() {
      return (Module._ts_node_symbol_wasm = Module.asm.ts_node_symbol_wasm).apply(null, arguments)
    }, Module._ts_node_child_count_wasm = function() {
      return (Module._ts_node_child_count_wasm = Module.asm.ts_node_child_count_wasm).apply(null, arguments)
    }, Module._ts_node_named_child_count_wasm = function() {
      return (Module._ts_node_named_child_count_wasm = Module.asm.ts_node_named_child_count_wasm).apply(null, arguments)
    }, Module._ts_node_child_wasm = function() {
      return (Module._ts_node_child_wasm = Module.asm.ts_node_child_wasm).apply(null, arguments)
    }, Module._ts_node_named_child_wasm = function() {
      return (Module._ts_node_named_child_wasm = Module.asm.ts_node_named_child_wasm).apply(null, arguments)
    }, Module._ts_node_child_by_field_id_wasm = function() {
      return (Module._ts_node_child_by_field_id_wasm = Module.asm.ts_node_child_by_field_id_wasm).apply(null, arguments)
    }, Module._ts_node_next_sibling_wasm = function() {
      return (Module._ts_node_next_sibling_wasm = Module.asm.ts_node_next_sibling_wasm).apply(null, arguments)
    }, Module._ts_node_prev_sibling_wasm = function() {
      return (Module._ts_node_prev_sibling_wasm = Module.asm.ts_node_prev_sibling_wasm).apply(null, arguments)
    }, Module._ts_node_next_named_sibling_wasm = function() {
      return (Module._ts_node_next_named_sibling_wasm = Module.asm.ts_node_next_named_sibling_wasm).apply(null, arguments)
    }, Module._ts_node_prev_named_sibling_wasm = function() {
      return (Module._ts_node_prev_named_sibling_wasm = Module.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments)
    }, Module._ts_node_parent_wasm = function() {
      return (Module._ts_node_parent_wasm = Module.asm.ts_node_parent_wasm).apply(null, arguments)
    }, Module._ts_node_descendant_for_index_wasm = function() {
      return (Module._ts_node_descendant_for_index_wasm = Module.asm.ts_node_descendant_for_index_wasm).apply(null, arguments)
    }, Module._ts_node_named_descendant_for_index_wasm = function() {
      return (Module._ts_node_named_descendant_for_index_wasm = Module.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments)
    }, Module._ts_node_descendant_for_position_wasm = function() {
      return (Module._ts_node_descendant_for_position_wasm = Module.asm.ts_node_descendant_for_position_wasm).apply(null, arguments)
    }, Module._ts_node_named_descendant_for_position_wasm = function() {
      return (Module._ts_node_named_descendant_for_position_wasm = Module.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments)
    }, Module._ts_node_start_point_wasm = function() {
      return (Module._ts_node_start_point_wasm = Module.asm.ts_node_start_point_wasm).apply(null, arguments)
    }, Module._ts_node_end_point_wasm = function() {
      return (Module._ts_node_end_point_wasm = Module.asm.ts_node_end_point_wasm).apply(null, arguments)
    }, Module._ts_node_start_index_wasm = function() {
      return (Module._ts_node_start_index_wasm = Module.asm.ts_node_start_index_wasm).apply(null, arguments)
    }, Module._ts_node_end_index_wasm = function() {
      return (Module._ts_node_end_index_wasm = Module.asm.ts_node_end_index_wasm).apply(null, arguments)
    }, Module._ts_node_to_string_wasm = function() {
      return (Module._ts_node_to_string_wasm = Module.asm.ts_node_to_string_wasm).apply(null, arguments)
    }, Module._ts_node_children_wasm = function() {
      return (Module._ts_node_children_wasm = Module.asm.ts_node_children_wasm).apply(null, arguments)
    }, Module._ts_node_named_children_wasm = function() {
      return (Module._ts_node_named_children_wasm = Module.asm.ts_node_named_children_wasm).apply(null, arguments)
    }, Module._ts_node_descendants_of_type_wasm = function() {
      return (Module._ts_node_descendants_of_type_wasm = Module.asm.ts_node_descendants_of_type_wasm).apply(null, arguments)
    }, Module._ts_node_is_named_wasm = function() {
      return (Module._ts_node_is_named_wasm = Module.asm.ts_node_is_named_wasm).apply(null, arguments)
    }, Module._ts_node_has_changes_wasm = function() {
      return (Module._ts_node_has_changes_wasm = Module.asm.ts_node_has_changes_wasm).apply(null, arguments)
    }, Module._ts_node_has_error_wasm = function() {
      return (Module._ts_node_has_error_wasm = Module.asm.ts_node_has_error_wasm).apply(null, arguments)
    }, Module._ts_node_is_missing_wasm = function() {
      return (Module._ts_node_is_missing_wasm = Module.asm.ts_node_is_missing_wasm).apply(null, arguments)
    }, Module._ts_query_matches_wasm = function() {
      return (Module._ts_query_matches_wasm = Module.asm.ts_query_matches_wasm).apply(null, arguments)
    }, Module._ts_query_captures_wasm = function() {
      return (Module._ts_query_captures_wasm = Module.asm.ts_query_captures_wasm).apply(null, arguments)
    }, Module._iswdigit = function() {
      return (Module._iswdigit = Module.asm.iswdigit).apply(null, arguments)
    }, Module._iswalpha = function() {
      return (Module._iswalpha = Module.asm.iswalpha).apply(null, arguments)
    }, Module._iswlower = function() {
      return (Module._iswlower = Module.asm.iswlower).apply(null, arguments)
    }, Module._towupper = function() {
      return (Module._towupper = Module.asm.towupper).apply(null, arguments)
    }, Module._memchr = function() {
      return (Module._memchr = Module.asm.memchr).apply(null, arguments)
    }, Module._strlen = function() {
      return (Module._strlen = Module.asm.strlen).apply(null, arguments)
    }, Module._setThrew = function() {
      return (Re = Module._setThrew = Module.asm.setThrew).apply(null, arguments)
    }),
    Ce = (Module.__Znwm = function() {
      return (Module.__Znwm = Module.asm._Znwm).apply(null, arguments)
    }, Module.__ZdlPv = function() {
      return (Module.__ZdlPv = Module.asm._ZdlPv).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function() {
      return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function() {
      return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function() {
      return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function() {
      return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function() {
      return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments)
    }, Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function() {
      return (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function() {
      return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function() {
      return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments)
    }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = function() {
      return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_).apply(null, arguments)
    }, Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function() {
      return (Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = Module.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(null, arguments)
    }, Module.stackSave = function() {
      return (Ce = Module.stackSave = Module.asm.stackSave).apply(null, arguments)
    }),
    qe = Module.stackAlloc = function() {
      return (qe = Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments)
    },
    Te = Module.stackRestore = function() {
      return (Te = Module.stackRestore = Module.asm.stackRestore).apply(null, arguments)
    },
    Fe = Module.___assign_got_enties = function() {
      return (Fe = Module.___assign_got_enties = Module.asm.__assign_got_enties).apply(null, arguments)
    },
    Le = (Module.dynCall_vi = function() {
      return (Module.dynCall_vi = Module.asm.dynCall_vi).apply(null, arguments)
    }, {
      __cxa_new_handler: 6112,
      __data_end: 6960,
      __THREW__: 6952,
      TRANSFER_BUFFER: 1472,
      __threwValue: 6956
    });
  for (var $e in Le) Module["_" + $e] = Se + Le[$e];
  for (var $e in Module.NAMED_GLOBALS = Le, Le) !function(e) {
      var t = Module["_" + e];
      Module["g$_" + e] = function() {
        return t
      }
    }($e);
  function We() {
    var e = Ce();
    try {
      var t = Array.prototype.slice.call(arguments);
      return R.get(t[0]).apply(null, t.slice(1))
    } catch (t) {
      if (Te(e), t !== t + 0 && "longjmp" !== t)
        throw t;
      Re(1, 0)
    }
  }
  function Ze(e) {
    this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
  }
  Module._fp$tree_sitter_log_callback$viii = function() {
    q(Module._tree_sitter_log_callback || !0, "external function `tree_sitter_log_callback` is missing.perhaps a side module was not linked in? if this symbol was expected to arrive from a system library, try to build the MAIN_MODULE with EMCC_FORCE_STDLIBS=XX in the environment");
    var e = Module.asm.tree_sitter_log_callback;
    e || (e = Module._tree_sitter_log_callback), e || (e = Module._tree_sitter_log_callback), e || (e = Ie);
    var t = I(e, "viii");
    return Module._fp$tree_sitter_log_callback$viii = function() {
        return t
      }, t
  }, Module.asm = xe, Module.allocate = function(e, t, r, n) {
    var o,
      s;
    "number" == typeof e ? (o = !0, s = e) : (o = !1, s = e.length);
    var _,
      a = "string" == typeof t ? t : null;
    if (_ = r == T ? n : [Pe, qe, h][r](Math.max(s, a ? 1 : t.length)), o) {
      var u;
      for (n = _, q(0 == (3 & _)), u = _ + (-4 & s); n < u; n += 4) D[n >> 2] = 0;
      for (u = _ + s; n < u;) O[n++ >> 0] = 0;
      return _
    }
    if ("i8" === a) return e.subarray || e.slice ? U.set(e, _) : U.set(new Uint8Array(e), _), _;
    for (var i, l, d, c = 0; c < s;) {
      var m = e[c];
      0 !== (i = a || t[c]) ? ("i64" == i && (i = "i32"), k(_ + c, m, i), d !== i && (l = g(i), d = i), c += l) : c++
    }
    return _
  }, Module.getMemory = F;
  function Oe(e) {
    function t() {
      Ae || (Ae = !0, C || (ee = !0, V(Q), V(Y), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), je && function(e) {
        var t = Module._main;
        if (t) try {
            Ue(t(0, 0), !0)
          } catch (e) {
            if (e instanceof Ze) return;
            if ("unwind" == e) return void (N = !0);
            var r = e;
            e && "object" == typeof e && e.stack && (r = [e, e.stack]), f("exception thrown: " + r), s(1, e)
          } finally {
            !0
        }
      }(), function() {
        if (Module.postRun)
          for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) e = Module.postRun.shift(), J.unshift(e);
        var e;
        V(J)
      }()))
    }
    e = e || o, _e > 0 || (!function() {
      if (Module.preRun)
        for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) te(Module.preRun.shift());
      V(X)
    }(), _e > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
      setTimeout(function() {
        Module.setStatus("")
      }, 1), t()
    }, 1)) : t()))
  }
  function Ue(e, t) {
    t && N && 0 === e || (N || (C = !0, e, !0, Module.onExit && Module.onExit(e)), s(e, new Ze(e)))
  }
  if (ue = function e() {
      Ae || Oe(), Ae || (ue = e)
    }, Module.run = Oe, Module.preInit)
    for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
  var je = !0;
  Module.noInitialRun && (je = !1), N = !0, Oe();
  const De = Module,
    Be = {},
    He = 4,
    ze = 5 * He,
    Ke = 2 * He,
    Ge = 2 * He + 2 * Ke,
    Ve = {
      row: 0,
      column: 0
    },
    Xe = /[\w-.]*/g,
    Qe = 1,
    Ye = 2,
    Je = /^_?tree_sitter_\w+/;
  var et,
    tt,
    rt,
    nt,
    ot,
    st = new Promise(e => {
      Module.onRuntimeInitialized = e
    }).then(() => {
      rt = De._ts_init(), et = P(rt, "i32"), tt = P(rt + He, "i32")
    });
  class Parser {
    static init() {
      return st
    }
    constructor() {
      if (null == rt)
        throw new Error("You must first call Parser.init() and wait for it to resolve.");
      De._ts_parser_new_wasm(), this[0] = P(rt, "i32"), this[1] = P(rt + He, "i32")
    }
    delete() {
      De._ts_parser_delete(this[0]), De._free(this[1])
    }
    setLanguage(e) {
      let t;
      if (e) {
        if (e.constructor !== Language)
          throw new Error("Argument must be a Language");
        {
          t = e[0];
          const r = De._ts_language_version(t);
          if (r < tt || et < r)
            throw new Error(`Incompatible language version ${r}. ` + `Compatibility range ${tt} through ${et}.`)
        }
      } else t = 0, e = null;
      return this.language = e, De._ts_parser_set_language(this[0], t), this
    }
    getLanguage() {
      return this.language
    }
    parse(e, t, r) {
      if ("string" == typeof e)
        nt = ((t, r, n) => e.slice(t, n));
      else {
        if ("function" != typeof e)
          throw new Error("Argument must be a string or a function");
        nt = e
      }
      this.logCallback ? (ot = this.logCallback, De._ts_parser_enable_logger_wasm(this[0], 1)) : (ot = null, De._ts_parser_enable_logger_wasm(this[0], 0));
      let n = 0,
        o = 0;
      if (r && r.includedRanges) {
        n = r.includedRanges.length;
        let e = o = De._calloc(n, Ge);
        for (let t = 0; t < n; t++) ht(e, r.includedRanges[t]), e += Ge
      }
      const s = De._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, o, n);
      if (!s)
        throw nt = null, ot = null, new Error("Parsing failed");
      const _ = new Tree(Be, s, this.language, nt);
      return nt = null, ot = null, _
    }
    reset() {
      De._ts_parser_parse_wasm(this[0])
    }
    setTimeoutMicros(e) {
      De._ts_parser_set_timeout_micros(this[0], e)
    }
    getTimeoutMicros(e) {
      De._ts_parser_timeout_micros(this[0])
    }
    setLogger(e) {
      if (e) {
        if ("function" != typeof e)
          throw new Error("Logger callback must be a function")
      } else
        e = null;
      return this.logCallback = e, this
    }
    getLogger() {
      return this.logCallback
    }
  }
  class Tree {
    constructor(e, t, r, n) {
      ut(e), this[0] = t, this.language = r, this.textCallback = n
    }
    copy() {
      const e = De._ts_tree_copy(this[0]);
      return new Tree(Be, e, this.language, this.textCallback)
    }
    delete() {
      De._ts_tree_delete(this[0])
    }
    edit(e) {
      !function(e) {
        let t = rt;
        ft(t, e.startPosition), ft(t += Ke, e.oldEndPosition), ft(t += Ke, e.newEndPosition), k(t += Ke, e.startIndex, "i32"), k(t += He, e.oldEndIndex, "i32"), k(t += He, e.newEndIndex, "i32"), t += He
      }(e), De._ts_tree_edit_wasm(this[0])
    }
    get rootNode() {
      return De._ts_tree_root_node_wasm(this[0]), dt(this)
    }
    getLanguage() {
      return this.language
    }
    walk() {
      return this.rootNode.walk()
    }
    getChangedRanges(e) {
      if (e.constructor !== Tree)
        throw new TypeError("Argument must be a Tree");
      De._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
      const t = P(rt, "i32"),
        r = P(rt + He, "i32"),
        n = new Array(t);
      if (t > 0) {
        let e = r;
        for (let r = 0; r < t; r++) n[r] = wt(e), e += Ge;
        De._free(r)
      }
      return n
    }
  }
  class Node {
    constructor(e, t) {
      ut(e), this.tree = t
    }
    get typeId() {
      return lt(this), De._ts_node_symbol_wasm(this.tree[0])
    }
    get type() {
      return this.tree.language.types[this.typeId] || "ERROR"
    }
    get endPosition() {
      return lt(this), De._ts_node_end_point_wasm(this.tree[0]), pt(rt)
    }
    get endIndex() {
      return lt(this), De._ts_node_end_index_wasm(this.tree[0])
    }
    get text() {
      return _t(this.tree, this.startIndex, this.endIndex)
    }
    isNamed() {
      return lt(this), 1 === De._ts_node_is_named_wasm(this.tree[0])
    }
    hasError() {
      return lt(this), 1 === De._ts_node_has_error_wasm(this.tree[0])
    }
    hasChanges() {
      return lt(this), 1 === De._ts_node_has_changes_wasm(this.tree[0])
    }
    isMissing() {
      return lt(this), 1 === De._ts_node_is_missing_wasm(this.tree[0])
    }
    equals(e) {
      if (this === e) return !0;
      for (let t = 0; t < 5; t++)
        if (this[t] !== e[t]) return !1;
      return !0
    }
    child(e) {
      return lt(this), De._ts_node_child_wasm(this.tree[0], e), dt(this.tree)
    }
    namedChild(e) {
      return lt(this), De._ts_node_named_child_wasm(this.tree[0], e), dt(this.tree)
    }
    childForFieldId(e) {
      return lt(this), De._ts_node_child_by_field_id_wasm(this.tree[0], e), dt(this.tree)
    }
    childForFieldName(e) {
      const t = this.tree.language.fields.indexOf(e);
      if (-1 !== t) return this.childForFieldId(t)
    }
    get childCount() {
      return lt(this), De._ts_node_child_count_wasm(this.tree[0])
    }
    get namedChildCount() {
      return lt(this), De._ts_node_named_child_count_wasm(this.tree[0])
    }
    get firstChild() {
      return this.child(0)
    }
    get firstNamedChild() {
      return this.namedChild(0)
    }
    get lastChild() {
      return this.child(this.childCount - 1)
    }
    get lastNamedChild() {
      return this.namedChild(this.namedChildCount - 1)
    }
    get children() {
      if (!this._children) {
        lt(this), De._ts_node_children_wasm(this.tree[0]);
        const e = P(rt, "i32"),
          t = P(rt + He, "i32");
        if (this._children = new Array(e), e > 0) {
          let r = t;
          for (let t = 0; t < e; t++) this._children[t] = dt(this.tree, r), r += ze;
          De._free(t)
        }
      }
      return this._children
    }
    get namedChildren() {
      if (!this._namedChildren) {
        lt(this), De._ts_node_named_children_wasm(this.tree[0]);
        const e = P(rt, "i32"),
          t = P(rt + He, "i32");
        if (this._namedChildren = new Array(e), e > 0) {
          let r = t;
          for (let t = 0; t < e; t++) this._namedChildren[t] = dt(this.tree, r), r += ze;
          De._free(t)
        }
      }
      return this._namedChildren
    }
    descendantsOfType(e, t, r) {
      Array.isArray(e) || (e = [e]), t || (t = Ve), r || (r = Ve);
      const n = [],
        o = this.tree.language.types;
      for (let t = 0, r = o.length; t < r; t++) e.includes(o[t]) && n.push(t);
      const s = De._malloc(He * n.count);
      for (let e = 0, t = n.length; e < t; e++) k(s + e * He, n[e], "i32");
      lt(this), De._ts_node_descendants_of_type_wasm(this.tree[0], s, n.length, t.row, t.column, r.row, r.column);
      const _ = P(rt, "i32"),
        a = P(rt + He, "i32"),
        u = new Array(_);
      if (_ > 0) {
        let e = a;
        for (let t = 0; t < _; t++) u[t] = dt(this.tree, e), e += ze
      }
      return De._free(a), De._free(s), u
    }
    get nextSibling() {
      return lt(this), De._ts_node_next_sibling_wasm(this.tree[0]), dt(this.tree)
    }
    get previousSibling() {
      return lt(this), De._ts_node_prev_sibling_wasm(this.tree[0]), dt(this.tree)
    }
    get nextNamedSibling() {
      return lt(this), De._ts_node_next_named_sibling_wasm(this.tree[0]), dt(this.tree)
    }
    get previousNamedSibling() {
      return lt(this), De._ts_node_prev_named_sibling_wasm(this.tree[0]), dt(this.tree)
    }
    get parent() {
      return lt(this), De._ts_node_parent_wasm(this.tree[0]), dt(this.tree)
    }
    descendantForIndex(e, t = e) {
      if ("number" != typeof e || "number" != typeof t)
        throw new Error("Arguments must be numbers");
      lt(this);
      let r = rt + ze;
      return k(r, e, "i32"), k(r + He, t, "i32"), De._ts_node_descendant_for_index_wasm(this.tree[0]), dt(this.tree)
    }
    namedDescendantForIndex(e, t = e) {
      if ("number" != typeof e || "number" != typeof t)
        throw new Error("Arguments must be numbers");
      lt(this);
      let r = rt + ze;
      return k(r, e, "i32"), k(r + He, t, "i32"), De._ts_node_named_descendant_for_index_wasm(this.tree[0]), dt(this.tree)
    }
    descendantForPosition(e, t = e) {
      if (!it(e) || !it(t))
        throw new Error("Arguments must be {row, column} objects");
      lt(this);
      let r = rt + ze;
      return ft(r, e), ft(r + Ke, t), De._ts_node_descendant_for_position_wasm(this.tree[0]), dt(this.tree)
    }
    namedDescendantForPosition(e, t = e) {
      if (!it(e) || !it(t))
        throw new Error("Arguments must be {row, column} objects");
      lt(this);
      let r = rt + ze;
      return ft(r, e), ft(r + Ke, t), De._ts_node_named_descendant_for_position_wasm(this.tree[0]), dt(this.tree)
    }
    walk() {
      return lt(this), De._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(Be, this.tree)
    }
    toString() {
      lt(this);
      const e = De._ts_node_to_string_wasm(this.tree[0]),
        t = function(e) {
          for (var t = "";;) {
            var r = U[e++ >> 0];
            if (!r) return t;
            t += String.fromCharCode(r)
          }
        }(e);
      return De._free(e), t
    }
  }
  class TreeCursor {
    constructor(e, t) {
      ut(e), this.tree = t, mt(this)
    }
    delete() {
      ct(this), De._ts_tree_cursor_delete_wasm(this.tree[0])
    }
    reset(e) {
      lt(e), ct(this, rt + ze), De._ts_tree_cursor_reset_wasm(this.tree[0]), mt(this)
    }
    get nodeType() {
      return this.tree.language.types[this.nodeTypeId] || "ERROR"
    }
    get nodeTypeId() {
      return ct(this), De._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])
    }
    get nodeId() {
      return ct(this), De._ts_tree_cursor_current_node_id_wasm(this.tree[0])
    }
    get nodeIsNamed() {
      return ct(this), 1 === De._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])
    }
    get nodeIsMissing() {
      return ct(this), 1 === De._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])
    }
    get nodeText() {
      ct(this);
      const e = De._ts_tree_cursor_start_index_wasm(this.tree[0]),
        t = De._ts_tree_cursor_end_index_wasm(this.tree[0]);
      return _t(this.tree, e, t)
    }
    get startPosition() {
      return ct(this), De._ts_tree_cursor_start_position_wasm(this.tree[0]), pt(rt)
    }
    get endPosition() {
      return ct(this), De._ts_tree_cursor_end_position_wasm(this.tree[0]), pt(rt)
    }
    get startIndex() {
      return ct(this), De._ts_tree_cursor_start_index_wasm(this.tree[0])
    }
    get endIndex() {
      return ct(this), De._ts_tree_cursor_end_index_wasm(this.tree[0])
    }
    currentNode() {
      return ct(this), De._ts_tree_cursor_current_node_wasm(this.tree[0]), dt(this.tree)
    }
    currentFieldId() {
      return ct(this), De._ts_tree_cursor_current_field_id_wasm(this.tree[0])
    }
    currentFieldName() {
      return this.tree.language.fields[this.currentFieldId()]
    }
    gotoFirstChild() {
      ct(this);
      const e = De._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
      return mt(this), 1 === e
    }
    gotoNextSibling() {
      ct(this);
      const e = De._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
      return mt(this), 1 === e
    }
    gotoParent() {
      ct(this);
      const e = De._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
      return mt(this), 1 === e
    }
  }
  class Language {
    constructor(e, t) {
      ut(e), this[0] = t, this.types = new Array(De._ts_language_symbol_count(this[0]));
      for (let e = 0, t = this.types.length; e < t; e++) De._ts_language_symbol_type(this[0], e) < 2 && (this.types[e] = W(De._ts_language_symbol_name(this[0], e)));
      this.fields = new Array(De._ts_language_field_count(this[0]) + 1);
      for (let e = 0, t = this.fields.length; e < t; e++) {
        const t = De._ts_language_field_name_for_id(this[0], e);
        this.fields[e] = 0 !== t ? W(t) : null
      }
    }
    get version() {
      return De._ts_language_version(this[0])
    }
    get fieldCount() {
      return this.fields.length - 1
    }
    fieldIdForName(e) {
      const t = this.fields.indexOf(e);
      return -1 !== t ? t : null
    }
    fieldNameForId(e) {
      return this.fields[e] || null
    }
    query(e) {
      const t = function(e) {
          for (var t = 0, r = 0; r < e.length; ++r) {
            var n = e.charCodeAt(r);
            n >= 55296 && n <= 57343 && (n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++r)), n <= 127 ? ++t : t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4
          }
          return t
        }(e),
        r = De._malloc(t + 1);
      (function(e, t, r, n) {
        if (!(n > 0)) return 0;
        for (var o = r, s = r + n - 1, _ = 0; _ < e.length; ++_) {
          var a = e.charCodeAt(_);
          if (a >= 55296 && a <= 57343 && (a = 65536 + ((1023 & a) << 10) | 1023 & e.charCodeAt(++_)), a <= 127) {
            if (r >= s) break;
            t[r++] = a
          } else if (a <= 2047) {
            if (r + 1 >= s) break;
            t[r++] = 192 | a >> 6, t[r++] = 128 | 63 & a
          } else if (a <= 65535) {
            if (r + 2 >= s) break;
            t[r++] = 224 | a >> 12, t[r++] = 128 | a >> 6 & 63, t[r++] = 128 | 63 & a
          } else {
            if (r + 3 >= s) break;
            t[r++] = 240 | a >> 18, t[r++] = 128 | a >> 12 & 63, t[r++] = 128 | a >> 6 & 63, t[r++] = 128 | 63 & a
          }
        }
        t[r] = 0
      })(e, U, r, t + 1);
      const n = De._ts_query_new(this[0], r, t, rt, rt + He);
      if (!n) {
        const t = P(rt + He, "i32"),
          n = W(r, P(rt, "i32")).length,
          o = e.substr(n, 100),
          s = o.match(Xe)[0];
        let _;
        switch (t) {
          case 2:
            _ = new RangeError(`Bad node name '${s}'`);
            break;case 3:
            _ = new RangeError(`Bad field name '${s}'`);
            break;case 4:
            _ = new RangeError(`Bad capture name @${s}`);
            break;default:
            _ = new SyntaxError(`Bad syntax at offset ${n}: '${o}'...`)
        }
        throw _.index = n, _.length = s.length, De._free(r), _
      }
      const o = De._ts_query_string_count(n),
        s = De._ts_query_capture_count(n),
        _ = De._ts_query_pattern_count(n),
        a = new Array(s),
        u = new Array(o);
      for (let e = 0; e < s; e++) {
        const t = De._ts_query_capture_name_for_id(n, e, rt),
          r = P(rt, "i32");
        a[e] = W(t, r)
      }
      for (let e = 0; e < o; e++) {
        const t = De._ts_query_string_value_for_id(n, e, rt),
          r = P(rt, "i32");
        u[e] = W(t, r)
      }
      const i = new Array(_),
        l = new Array(_),
        d = new Array(_),
        c = new Array(_);
      for (let e = 0; e < _; e++) {
        const t = De._ts_query_predicates_for_pattern(n, e, rt),
          r = P(rt, "i32");
        c[e] = [];const o = [];
        let s = t;
        for (let t = 0; t < r; t++) {
          const t = P(s, "i32"),
            r = P(s += He, "i32");
          if (s += He, t === Qe) o.push({
              type: "capture",
              name: a[r]
            });
          else if (t === Ye) o.push({
              type: "string",
              value: u[r]
            });
          else if (o.length > 0) {
            if ("string" !== o[0].type)
              throw new Error("Predicates must begin with a literal value");
            const t = o[0].value;
            let r = !0;
            switch (t) {
              case "not-eq?":
                r = !1;case "eq?":
                if (3 !== o.length)
                  throw new Error(`Wrong number of arguments to \`eq?\` predicate. Expected 2, got ${o.length - 1}`);
                if ("capture" !== o[1].type)
                  throw new Error(`First argument of \`eq?\` predicate must be a capture. Got "${o[1].value}"`);
                if ("capture" === o[2].type) {
                  const t = o[1].name,
                    n = o[2].name;
                  c[e].push(function(e) {
                    let o,
                      s;
                    for (const r of e) r.name === t && (o = r.node), r.name === n && (s = r.node);
                    return o.text === s.text === r
                  })
                } else {
                  const t = o[1].name,
                    n = o[2].value;
                  c[e].push(function(e) {
                    for (const o of e)
                      if (o.name === t) return o.node.text === n === r;
                    return !1
                  })
                }
                break;case "match?":
                if (3 !== o.length)
                  throw new Error(`Wrong number of arguments to \`match?\` predicate. Expected 2, got ${o.length - 1}.`);
                if ("capture" !== o[1].type)
                  throw new Error(`First argument of \`match?\` predicate must be a capture. Got "${o[1].value}".`);
                if ("string" !== o[2].type)
                  throw new Error(`Second argument of \`match?\` predicate must be a string. Got @${o[2].value}.`);
                const n = o[1].name,
                  s = new RegExp(o[2].value);
                c[e].push(function(e) {
                  for (const t of e)
                    if (t.name === n) return s.test(t.node.text);
                  return !1
                });
                break;case "set!":
                if (o.length < 2 || o.length > 3)
                  throw new Error(`Wrong number of arguments to \`set!\` predicate. Expected 1 or 2. Got ${o.length - 1}.`);
                if (o.some(e => "string" !== e.type))
                  throw new Error('Arguments to `set!` predicate must be a strings.".');
                i[e] || (i[e] = {}), i[e][o[1].value] = o[2] ? o[2].value : null;
                break;case "is?":
              case "is-not?":
                if (o.length < 2 || o.length > 3)
                  throw new Error(`Wrong number of arguments to \`${t}\` predicate. Expected 1 or 2. Got ${o.length - 1}.`);
                if (o.some(e => "string" !== e.type))
                  throw new Error(`Arguments to \`${t}\` predicate must be a strings.".`);
                const _ = "is?" === t ? l : d;
                _[e] || (_[e] = {}), _[e][o[1].value] = o[2] ? o[2].value : null;
                break;default:
                throw new Error(`Unknown query predicate \`${o[0].value}\``)
            }
            o.length = 0
          }
        }
        Object.freeze(i[e]), Object.freeze(l[e]), Object.freeze(d[e])
      }
      return De._free(r), new Query(Be, n, a, c, Object.freeze(i), Object.freeze(l), Object.freeze(d))
    }
    static load(e) {
      let t;
      if ("undefined" != typeof process && process.versions && process.versions.node) {
        const r = require("fs");
        t = Promise.resolve(r.readFileSync(e))
      } else
        t = fetch(e).then(e => e.arrayBuffer().then(t => {
          if (e.ok) return new Uint8Array(t);
          {
            const r = new TextDecoder("utf-8").decode(t);
            throw new Error(`Language.load failed with status ${e.status}.

${r}`)
          }
        }));
      return t.then(e => E(e, {
        loadAsync: !0
      })).then(e => {
        const t = e[Object.keys(e).find(e => Je.test(e) && !e.includes("external_scanner_"))]();
        return new Language(Be, t)
      })
    }
  }
  class Query {
    constructor(e, t, r, n, o, s, _) {
      ut(e), this[0] = t, this.captureNames = r, this.predicates = n, this.setProperties = o, this.assertedProperties = s, this.refutedProperties = _
    }
    delete() {
      De._ts_query_delete(this[0])
    }
    matches(e, t, r) {
      t || (t = Ve), r || (r = Ve), lt(e), De._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, r.row, r.column);
      const n = P(rt, "i32"),
        o = P(rt + He, "i32"),
        s = new Array(n);
      let _ = o;
      for (let t = 0; t < n; t++) {
        const r = P(_, "i32"),
          n = P(_ += He, "i32");
        _ += He;const o = new Array(n);
        if (_ = at(this, e.tree, _, o), this.predicates[r].every(e => e(o))) {
          s[t] = {
            pattern: r,
            captures: o
          };
          const e = this.setProperties[r];
          e && (s[t].setProperties = e);
          const n = this.assertedProperties[r];
          n && (s[t].assertedProperties = n);
          const _ = this.refutedProperties[r];
          _ && (s[t].refutedProperties = _)
        }
      }
      return De._free(o), s
    }
    captures(e, t, r) {
      t || (t = Ve), r || (r = Ve), lt(e), De._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, r.row, r.column);
      const n = P(rt, "i32"),
        o = P(rt + He, "i32"),
        s = [],
        _ = [];
      let a = o;
      for (let t = 0; t < n; t++) {
        const t = P(a, "i32"),
          r = P(a += He, "i32"),
          n = P(a += He, "i32");
        if (a += He, _.length = r, a = at(this, e.tree, a, _), this.predicates[t].every(e => e(_))) {
          const e = _[n],
            r = this.setProperties[t];
          r && (e.setProperties = r);
          const o = this.assertedProperties[t];
          o && (e.assertedProperties = o);
          const a = this.refutedProperties[t];
          a && (e.refutedProperties = a), s.push(e)
        }
      }
      return De._free(o), s
    }
  }
  function _t(e, t, r) {
    const n = r - t;
    let o = e.textCallback(t, null, r);
    for (t += o.length; t < r;) {
      const n = e.textCallback(t, null, r);
      if (!(n && n.length > 0)) break;
      t += n.length, o += n
    }
    return t > r && (o = o.slice(0, n)), o
  }
  function at(e, t, r, n) {
    for (let o = 0, s = n.length; o < s; o++) {
      const s = P(r, "i32"),
        _ = dt(t, r += He);
      r += ze, n[o] = {
        name: e.captureNames[s],
        node: _
      }
    }
    return r
  }
  function ut(e) {
    if (e !== Be)
      throw new Error("Illegal constructor")
  }
  function it(e) {
    return e && "number" == typeof e.row && "number" == typeof e.column
  }
  function lt(e) {
    let t = rt;
    k(t, e.id, "i32"), k(t += He, e.startIndex, "i32"), k(t += He, e.startPosition.row, "i32"), k(t += He, e.startPosition.column, "i32"), k(t += He, e[0], "i32")
  }
  function dt(e, t = rt) {
    const r = P(t, "i32");
    if (0 === r) return null;
    const n = P(t += He, "i32"),
      o = P(t += He, "i32"),
      s = P(t += He, "i32"),
      _ = P(t += He, "i32"),
      a = new Node(Be, e);
    return a.id = r, a.startIndex = n, a.startPosition = {
        row: o,
        column: s
      }, a[0] = _, a
  }
  function ct(e, t = rt) {
    k(t + 0 * He, e[0], "i32"), k(t + 1 * He, e[1], "i32"), k(t + 2 * He, e[2], "i32")
  }
  function mt(e) {
    e[0] = P(rt + 0 * He, "i32"), e[1] = P(rt + 1 * He, "i32"), e[2] = P(rt + 2 * He, "i32")
  }
  function ft(e, t) {
    k(e, t.row, "i32"), k(e + He, t.column, "i32")
  }
  function pt(e) {
    return {
      row: P(e, "i32"),
      column: P(e + He, "i32")
    }
  }
  function ht(e, t) {
    ft(e, t.startPosition), ft(e += Ke, t.endPosition), k(e += Ke, t.startIndex, "i32"), k(e += He, t.endIndex, "i32"), e += He
  }
  function wt(e) {
    const t = {};
    return t.startPosition = pt(e), e += Ke, t.endPosition = pt(e), e += Ke, t.startIndex = P(e, "i32"), e += He, t.endIndex = P(e, "i32"), t
  }
  return Parser.Language = Language, Parser
});
