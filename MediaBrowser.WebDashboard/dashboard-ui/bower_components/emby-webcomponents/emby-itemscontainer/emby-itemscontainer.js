define(["itemShortcuts","connectionManager","layoutManager","browser","dom","loading","serverNotifications","events","registerElement"],function(itemShortcuts,connectionManager,layoutManager,browser,dom,loading,serverNotifications,events){"use strict";function onClick(e){var itemsContainer=this,multiSelect=(e.target,itemsContainer.multiSelect);multiSelect&&multiSelect.onContainerClick.call(itemsContainer,e)===!1||itemShortcuts.onClick.call(itemsContainer,e)}function disableEvent(e){return e.preventDefault(),e.stopPropagation(),!1}function onContextMenu(e){var itemsContainer=this,target=e.target,card=dom.parentWithAttribute(target,"data-id");if(card)return itemShortcuts.showContextMenu(card,{positionTo:target,itemsContainer:itemsContainer}),e.preventDefault(),e.stopPropagation(),!1}function getShortcutOptions(){return{click:!1}}function onDrop(evt,itemsContainer){var el=evt.item,newIndex=evt.newIndex,itemId=el.getAttribute("data-playlistitemid"),playlistId=el.getAttribute("data-playlistid");if(!playlistId){var oldIndex=evt.oldIndex;return void el.dispatchEvent(new CustomEvent("itemdrop",{detail:{oldIndex:oldIndex,newIndex:newIndex,playlistItemId:itemId},bubbles:!0,cancelable:!1}))}var serverId=el.getAttribute("data-serverid"),apiClient=connectionManager.getApiClient(serverId);newIndex=Math.max(0,newIndex-1),loading.show(),apiClient.ajax({url:apiClient.getUrl("Playlists/"+playlistId+"/Items/"+itemId+"/Move/"+newIndex),type:"POST"}).then(function(){loading.hide()},function(){loading.hide(),itemsContainer.dispatchEvent(new CustomEvent("needsrefresh",{detail:{},cancelable:!1,bubbles:!0}))})}function onUserDataChanged(e,apiClient,userData){var itemsContainer=this;require(["cardBuilder"],function(cardBuilder){cardBuilder.onUserDataChanged(userData,itemsContainer)})}function onTimerCreated(e,apiClient,data){var itemsContainer=this,programId=data.ProgramId,newTimerId=data.Id;require(["cardBuilder"],function(cardBuilder){cardBuilder.onTimerCreated(programId,newTimerId,itemsContainer)})}function onSeriesTimerCreated(e,apiClient,data){}function onTimerCancelled(e,apiClient,data){var itemsContainer=this,id=data.Id;require(["cardBuilder"],function(cardBuilder){cardBuilder.onTimerCancelled(id,itemsContainer)})}function onSeriesTimerCancelled(e,apiClient,data){var itemsContainer=this,id=data.Id;require(["cardBuilder"],function(cardBuilder){cardBuilder.onSeriesTimerCancelled(id,itemsContainer)})}function addNotificationEvent(instance,name,handler){var localHandler=handler.bind(instance);events.on(serverNotifications,name,localHandler),instance[name]=localHandler}function removeNotificationEvent(instance,name){var handler=instance[name];handler&&(events.off(serverNotifications,"UserDataChanged",handler),instance[name]=null)}var ItemsContainerProtoType=Object.create(HTMLDivElement.prototype);ItemsContainerProtoType.enableHoverMenu=function(enabled){var current=this.hoverMenu;if(!enabled)return void(current&&(current.destroy(),this.hoverMenu=null));if(!current){var self=this;require(["itemHoverMenu"],function(ItemHoverMenu){self.hoverMenu=new ItemHoverMenu(self)})}},ItemsContainerProtoType.enableMultiSelect=function(enabled){var current=this.multiSelect;if(!enabled)return void(current&&(current.destroy(),this.multiSelect=null));if(!current){var self=this;require(["multiSelect"],function(MultiSelect){self.multiSelect=new MultiSelect({container:self,bindOnClick:!1})})}},ItemsContainerProtoType.enableDragReordering=function(enabled){var current=this.sortable;if(!enabled)return void(current&&(current.destroy(),this.sortable=null));if(!current){var self=this;require(["sortable"],function(Sortable){self.sortable=new Sortable(self,{draggable:".listItem",handle:".listViewDragHandle",onEnd:function(evt){return onDrop(evt,self)}})})}},ItemsContainerProtoType.createdCallback=function(){this.classList.add("itemsContainer")},ItemsContainerProtoType.attachedCallback=function(){this.addEventListener("click",onClick),browser.touch?this.addEventListener("contextmenu",disableEvent):"false"!==this.getAttribute("data-contextmenu")&&this.addEventListener("contextmenu",onContextMenu),layoutManager.desktop&&this.enableHoverMenu(!0),(layoutManager.desktop||layoutManager.mobile)&&this.enableMultiSelect(!0),itemShortcuts.on(this,getShortcutOptions()),addNotificationEvent(this,"UserDataChanged",onUserDataChanged),addNotificationEvent(this,"TimerCreated",onTimerCreated),addNotificationEvent(this,"SeriesTimerCreated",onSeriesTimerCreated),addNotificationEvent(this,"TimerCancelled",onTimerCancelled),addNotificationEvent(this,"SeriesTimerCancelled",onSeriesTimerCancelled),"true"===this.getAttribute("data-dragreorder")&&this.enableDragReordering(!0)},ItemsContainerProtoType.detachedCallback=function(){this.enableHoverMenu(!1),this.enableMultiSelect(!1),this.enableDragReordering(!1),this.removeEventListener("click",onClick),this.removeEventListener("contextmenu",onContextMenu),this.removeEventListener("contextmenu",disableEvent),itemShortcuts.off(this,getShortcutOptions()),removeNotificationEvent(this,"UserDataChanged"),removeNotificationEvent(this,"TimerCreated"),removeNotificationEvent(this,"SeriesTimerCreated"),removeNotificationEvent(this,"TimerCancelled"),removeNotificationEvent(this,"SeriesTimerCancelled")},document.registerElement("emby-itemscontainer",{prototype:ItemsContainerProtoType,extends:"div"})});