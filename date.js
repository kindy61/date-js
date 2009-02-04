
/**
  How to use
  
  var d = date(),
      D = new Date(); //just like new Date()
  
  D.getMonth() == d.m()
  D.getFullYear() == d.Y()
  
  D.setFullYear(1999) == d.Y(1999)
  D.setHours(8) == d.H(8)
  
  // ...
  // Y ~ FullYear
  // m ~ Month
  // d ~ Date
  // H ~ Hours
  // M ~ Minutes
  // S ~ Seconds
  // s ~ Milliseconds
  // t ~ Time
  // ...
  
  d.set('m+1') == D.setMonth(D.getMonth() + 1)
  d.set('Y2008m0') == (D.setFullYear(2008) && D.setMonth(0))
  
  d.fmt('%Y-%m-%d %H:%M:%S.%s %%s') == '2009-02-04 22:23:45 %s'
  
  
*/
var date = (function(){
  function now(){return new date()}
  
  function iter(obj, fn, o){
    o = o || obj;
    if(!(obj && typeof obj == 'object')){
      return;
    }
    var i,
        l = obj.length;
    if(typeof l == 'number'){
      if(l){
        for(i=0;i<l;i++){
          if(fn.call(o, obj[i], i, obj) === false){
            break;
          }
        }
      }
    }else{
      for(i in obj){
        if(obj.hasOwnProperty(i)){
          if(fn.call(o, obj[i], i, obj) === false){
            break;
          }
        }
      }
    }
    
    return iter;
  }
  
  function mixin(target, source){
    for (var x in source) {
      target[x] = source[x];
    }
    
    return mixin;
  }
  
  function date(Y, m, d, H, M, S, s){
    var r = this;
    if(this instanceof date){
      this._d = new Date;
    }else{
      r = new date;
    }
    if(arguments.length){
      r.t(new Date(Y, m, d, H, M, S, s).getTime());
    }
    return r;
  }
  
  mixin(date,
    {
      conv:{
        'Wm':10080,
        'dm':1440,
        'WS':604800,
        'dS':86400,

        'Ws':604800000,
        'ds':86400000,
        'Hs':3600000,
        'Ms':60000,
        'Ss':1000,
        'ss':1
      },
      from:function(s){
        return new date().set(s);
      },
      clone:function(s){
        return new date(this.t()).set(s);
      }
    }
  );
  
  iter(
    {
      Y: 'FullYear',
      m: 'Month',
      d: 'Date',
      H: 'Hours',
      M: 'Minutes',
      S: 'Seconds',
      s: 'Milliseconds',
      t: 'Time'
    },
    function(v, k){
      date.prototype[k] = 
        (function(s,g){
          return function(v) {
            v!==undefined && v!==null && this._d[s](v);
            return this._d[g]();
          }
        })('set' + v, 'get' + v);
    }
  );
  
  mixin(date.prototype,
    {
      set: function(str){
        var d= this;
        str.replace(
          /[YmdWHMSs][+-]?\d+/g,
          function(w){
            w= w.match(/(\w)([+-]?)(\d+)/);

            var f=w[1],  //key
                v= w[3], //value
                s= w[2]; //type(+/-)
            
            if(s==''){
              if(f=='Y' && v.length < 4){
                v= '' + String(now().Y()).slice(0,4-v.length) + v
              }
              
              if(f=='m'){
                v= parseInt(v)-1;
                d.m(v);
              }else if(f=='W'){
                v= parseInt(v)-d.getDay();
                if(v){
                  d.set('d' + (v>0?'+':'') + v);
                }
              }else{
                d[f](parseInt(v))
              }
            }else{
              (v= parseInt(v)) && (s=='-') && (v=-v);// fixme can this be v=parseInt(s+v)
              if(v){
                switch(f){
                  case 'Y':
                  case 'm':
                    d[f](d[f]()+v);
                    break;
                  default:// dWHMSs
                    d.t(d.t() + v * date.conv[f+'s']);
                    break;
                }
              }
            }
            return ''
          }
        );
        return this
      },
      fmt: function(str){
        if(!str){
          str = 'YY-mm-dd HH:MM:SS';
        }
        var d= this;
        
        return str.replace(
          /%([YmdHMS%])/g,
          function(w, s){
            return s == '%' ?
              s :
              (('' + d[s]()).replace(/^(\d)$/, '0$1'));
          }
        );
      },
      toString: function(){
        return this._d.toString.apply(this._d, arguments);
      },
      valueOf: function(){
        return this._d.valueOf.apply(this._d, arguments);
      }
    }
  );
  //date.prototype.str = date.prototype.format = date.prototype.strfmt = date.prototype.fmt;
  
  return {
    iter: iter,
    mixin: mixin,
    date: date,
    now: now
  };
})().date;

