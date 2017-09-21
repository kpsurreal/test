/*
    Name: realtime.js
    Author: Rango / yuanoook@foxmail.com
    Source: https://github.com/yuanoook/realtime

    Let's Realtime The World!
*/

!function(){
  var references = {};

  window.REALTIME = {
    references: references,
    Reference: getReference,
    ServerValue: {
      TIMESTAMP: {
        '.sv': 'ums'
      }
    }
  }

  function getReference(pathname){
    //make sure that the pathname is correct;
    //i.e: / /pathname /pathname/subpathname
    pathname = (pathname || '/').replace(/\/\/+/g,'/').replace(/\/$/,'') || '/';
    references[pathname] = references[pathname] || new Reference(pathname);
    return references[pathname];
  }

  function Reference(pathname){
    this.id = uniqueMillisecond();
    this.pathname = pathname;
    this.eventListener = {
      //event_type: [callback1, callback2]
    };

    this.Host = REALTIME.Host = REALTIME.Host || new Host();//host in the RAM
    this.Host.clients[this.id] = this;
  }

  Reference.prototype = {
    set: function(setter,callback){
      this.Host.set(this.id,this.pathname,setter,callback);
      return this;
    },
    get: function(callback){
      this.Host.get(this.id,this.pathname,callback);
      return this;
    },
    on: function(event_type,callback,err_callback){
      this.eventListener[event_type] = this.eventListener[event_type] || [];
      this.eventListener[event_type].push([callback,err_callback]);
      this.Host.addEventListener(this.id,this.pathname,event_type);
      return this;
    },
    receiveEvent: function(event_type,e){
      var snapshot = new SnapShot(this.pathname,e);
      this.eventListener[event_type] = this.eventListener[event_type] || [];
      this.eventListener[event_type].forEach(function(callbacks){
        var callback = callbacks[0];
        var err_callback = callback[1];
        callback && callback(snapshot);
        e.err && err_callback && err_callback(e.err);
      });
    },
    child: function(pathname){
      var childPahtname = this.pathname+'/'+pathname;
      return getReference(childPahtname);
    },
    parent: function(){
      var parentPathname = getParentPathname(this.pathname);
      return parentPathname==this.pathname ? undefined : getReference(parentPathname);
    },
    root: function(){
      return getReference('/');
    }
  }

  function SnapShot(pathname,e){
    this.pathname = e.event_type == 'value' ? pathname : (pathname != '/' ? pathname+'/' : pathname) + e.child_key;
    this.event = e;
    this.key = e.event_type != 'value' ? e.child_key : pathname.replace(/^.*?([^\/]*)$/,'$1');
  }

  SnapShot.prototype = {
    val: function(){
      return this.event.event_type == 'child_removed' ? this.event.old_value : this.event.value;
    },
    reference: function(){
      return getReference(this.pathname);
    }
  }

  function Host(){
    this.data = {};
    this.clients = {};
    this.listened_events = {
      // pathname: {
      //   event_type: [
      //     who1, who2, who3
      //   ]
      // }
      // see export_events
    };
    this.set_logs = [
      // [who,when,pathname,value,old_value]
    ];
    this.event_logs = [
      // [when,pathname,+/-,+/-,N/V,value]
    ];
  }

  Host.prototype = {
    pushValue: function(pathname,value){//private method
      value = copyValue(value);//prevent overwrite obj;
      if(pathname=='/'){
        this.data = value;
        return this;
      }
      keys_string = pathname.replace(/^\//,'');//for split
      var subkey,
      subobj = this.data,
      keys_arr = keys_string.split('/');
      while(keys_arr.length>1)(
        subkey = keys_arr.shift(),
        subobj = subobj[subkey] = (
          isNode(subobj[subkey])
          ? subobj[subkey]
          : {}
        )
      )
      if(value === null){
        delete subobj[ keys_arr.shift() ];
      }else{
        subobj[ keys_arr.shift() ] = value;
      }
      return this;
    },
    pullValue: function(pathname){//private method
      if(pathname=='/'){
        return this.data;
      }
      keys_string = pathname.replace(/^\//,'');//for split
      var keys_arr = keys_string.split('/');
      var subobj = this.data;
      try{
        while(keys_arr.length)
        subobj = subobj[ keys_arr.shift() ];
        return isNull(subobj) ? null : subobj;
      }catch(e){
        return null;
      }
    },
    backupOldData: function(){
      this.old_data = copyValue(this.data);
      return this;
    },
    set: function(who,pathname,setter,callback){
      if( !this.isSetable(pathname) ){
        callback && callback('Error: Parent node cannot be found!')//prevent to set new value under not-a-node that may overwrite existed-value
        return this;
      }
      var old_value = this.pullValue(pathname);
      var value = isFunction(setter) ? setter(old_value) : setter;
      //new value can be null( means remove subpathname ), but cannot be undefined, if it's undefined, ignore it;
      if(value===undefined){
        callback && callback('Error: Cannot set undefined as new value!');
        return this;
      }

      value = correctServerValue(value);

      try{
        this.backupOldData();
        this.pushValue(pathname,value);
      }catch(e){
        callback && callback(e.toString());
        return this;
      }

      this.logSet(who,pathname,value,old_value);
      callback && callback();
      return this;
    },
    isSetable: function(pathname){
      var parent_pathname = getParentPathname(pathname);
      var parent_node = this.pullValue(parent_pathname);
      return pathname=='/' || isNode(parent_node) || (isNull(parent_node) && this.isSetable(parent_pathname));
    },
    get: function(who,pathname,callback){
      callback && callback( this.pullValue(pathname) );
    },
    logSet: function(who,pathname,value,old_value){
      // [who,when,pathname,value,old_value]
      var set_log = [
        who, uniqueMillisecond(), pathname, JSON.stringify(value), JSON.stringify(old_value)
      ];
      this.set_logs.push(set_log);
      this.logEvent(set_log);
      return this;
    },
    logEvent: function(set_log){
      var me = this;
      var when = set_log[1];
      var pathname = set_log[2]
      var value =  JSON.parse(set_log[3]);
      var old_value = JSON.parse(set_log[4]);

      //find the diff between value and old_value;
      var new_pathnames = listPathnames('/',value);
      var old_pathnames = listPathnames('/',old_value);
      var all_pathnames = uniqueArray(new_pathnames.concat(old_pathnames));

      var value_subhost = {data:value};
      var old_value_subhost = {data:old_value};
      var differences = [
        // [pathname,path_value,path_old_value]
      ];
      all_pathnames.forEach(function(pathname){
        var path_value = me.pullValue.call(value_subhost,pathname);
        var path_old_value = me.pullValue.call(old_value_subhost,pathname);
        //if both is node, no different; both is value and equal, no different
        var is_different = (
          !isNode(path_value) || !isNode(path_old_value)
        ) && (
          path_value!==path_old_value
        );
        //if different, log a difference
        is_different && differences.push([pathname,path_value,path_old_value]);
      });

      var new_event_logs = differences.map(function(difference){
        var diff_pathname = difference[0];
        var diff_full_pathname = (diff_pathname == '/'
          ? pathname
          : (pathname + '/' + diff_pathname).replace(/\/\/+/g,'/')
        );
        var path_value = difference[1];
        var path_old_value = difference[2];

        // [when,pathname,+/-,+/-,N/V,value,old_value]
        var current_existed = !isNull(path_value);
        var past_existed = !isNull(path_old_value);
        var path_value_type = isNode(path_value) ? 'N' : 'V';

        var new_event_log = [when, diff_full_pathname, past_existed, current_existed, path_value_type, path_value, path_old_value];

        //log the event;
        me.event_logs.push(new_event_log);
        return new_event_log;
      });

      this.exportEvents(new_event_logs);

      return this;

      function listPathnames(pathname,obj){
        pathname = (pathname||'/').replace(/\/\/+/g,'/');
        var result = [pathname];
        if( !isNode(obj) ){
          return result;
        }
        for(var key in obj) obj.hasOwnProperty(key) && (
          result = result.concat( listPathnames(pathname+'/'+key,obj[key]) )
        );
        return result;
      }
    },
    exportEvents: function(events){
      var me = this;
      // [when,pathname,+/-,+/-,N/V,value,old_value]
      /*
        TODO: analysis high-class event_type and deliver
          high-class event_types:
            child_removed
            child_added
            child_changed
            value
      */
      var export_events = {
        // pathname: {
        //   event_type: {
        //      value: value,
        //      old_value: old_value
        //      child_key: child_key
        //      event_type: event_type
        //   }
        // }
        // see this.listened_events
      };

      events.forEach(function(e){
        var pathname = e[1];
        var past_existed = e[2];
        var current_existed = e[3];
        var type = e[4];
        var value = e[5];
        var old_value = e[6];

        addExportEvent(pathname,'value',value,old_value);

        var parent_pathname = getParentPathname(pathname);
        if(parent_pathname==pathname){return;}

        var child_key = pathname.replace(/^.*?([^\/]*)$/,'$1');
        var parent_event_type;
         past_existed &&  current_existed && (parent_event_type='child_changed');
         past_existed && !current_existed && (parent_event_type='child_removed');
        !past_existed &&  current_existed && (parent_event_type='child_added');

        addExportEvent(parent_pathname,parent_event_type,value,old_value,child_key);
      });
      // console.log(export_events);
      this.deliverEvents( copyValue(export_events) );

      return this;

      function addExportEvent(pathname,event_type,value,old_value,child_key){
        var export_event = {
          value:value,
          old_value:old_value,
          child_key:child_key,
          event_type:event_type
        };
        var pathname_events = export_events[pathname] = export_events[pathname] || {};

        if( event_type=='value' ){
          pathname_events[event_type] = export_event;
        }else{
          var pathname_event_type_events = pathname_events[event_type] = pathname_events[event_type] || {};
          pathname_event_type_events[child_key] = export_event;
        }

        if(pathname==getParentPathname(pathname)){return;}

        if( event_type=='value' ){
          pathname = getParentPathname(pathname);//bubble the event
          value = me.pullValue(pathname);
          old_value = me.pullValue.call({data:me.old_data},pathname);
          addExportEvent(pathname,event_type,value,old_value);
        }

        if( event_type=='child_changed' ){
          child_key = pathname.replace(/^.*?([^\/]*)$/,'$1');
          value = me.pullValue(pathname);
          old_value = me.pullValue.call({data:me.old_data},pathname);
          pathname = getParentPathname(pathname);//bubble the event
          addExportEvent(pathname,event_type,value,old_value,child_key);
        }
      }
    },
    deliverEvents: function(export_events){
      var me = this;
      for(var pathname in export_events){
        if(!export_events.hasOwnProperty(pathname)){continue;}
        var events = export_events[pathname];
        for(event_type in events){
          if(!events.hasOwnProperty(event_type)){continue;}
          if(this.listened_events[pathname] && this.listened_events[pathname][event_type]){
            this.listened_events[pathname][event_type].forEach(function(who){
              if(event_type=='value'){
                me.notifyEvent(who,event_type,events[event_type]);
              }else{
                for(var child_key in events[event_type]){
                  if(!events[event_type].hasOwnProperty(child_key)){continue;}
                  me.notifyEvent(who,event_type,events[event_type][child_key]);
                }
              }
            });
          }
        }
      }
      return this;
    },
    addEventListener: function(who,pathname,event_type){
      this.listened_events[pathname] = this.listened_events[pathname]||{};
      this.listened_events[pathname][event_type] = this.listened_events[pathname][event_type]||[];
      this.listened_events[pathname][event_type].push(who);

      if( event_type=='value' ){
        var value = this.pullValue(pathname);
        this.notifyEvent(who,'value',{
         event_type: 'value',
         value: value,
         err: isNull(value) ? 'Data node cannot be found!' : null
       });
      }

      return this;
    },
    notifyEvent: function(who,event_type,e){
      this.clients[who].receiveEvent(event_type,e);
    }
  }

  function copyValue(obj){
    try{
      obj = isNode(obj) ? JSON.parse(JSON.stringify(obj)) : obj;
    }catch(e){
      throw new Error('New value cannot be parsed!');
    }
    return obj;
  }

  function correctServerValue(value){
    if( isNode(value) ){
      if( value['.sv'] && value['.sv']=='ums' ){
        return uniqueMillisecond();
      }
      for(var key in value){
        value.hasOwnProperty(key) && (value[key] = correctServerValue(value[key]));
      }
      return value;
    }
    return value;
  }

  function uniqueArray(arr){
    return arr.filter(function(value,index,self){
        return self.indexOf(value) === index;
    });
  }

  function isFunction(obj){
    return /Function/.test(Object.prototype.toString.call(obj));
  }

  function isNode(obj){
    return !/Number|String|Null|Undefined|Boolean/.test(Object.prototype.toString.call(obj));
  }

  function isValue(obj){
    return /Number|String|Boolean/.test(Object.prototype.toString.call(obj));
  }

  function isNull(obj){
    return /Null|Undefined/.test(Object.prototype.toString.call(obj));
  }

  function getParentPathname(pathname){
    return pathname.replace(/\/\/+/g,'/').replace(/\/[^\/]+\/?$/,'') || '/';
  }

}();
