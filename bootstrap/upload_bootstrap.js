// each upload_multiple template instance holds its own local collection of files list
Template['upload_bootstrap'].created = function () {
  // this is used to view the queue in the interface
  this.data.queueView = new ReactiveVar([]);
  // this holds all the data about the queue
  this.data.queue = [];
  // info about the global item being processed
  this.data.info = new ReactiveVar
  // info about global progress
  this.data.globalInfo = new ReactiveVar({running: false, progress: 0, bitrate: 0});
};

Template['upload_bootstrap'].helpers({
  'infoLabel': function() {
    var progress = this.globalInfo.get();

    // we may have not yet selected a file
    if (!this.info.get()) {
      return "";
    }

    return progress.running ?
      Uploader.formatProgress(this.info.get().name, progress.progress, progress.bitrate) :
      (this.info.get().name + '&nbsp;<span style="font-size: smaller; color: grey">' + bytesToSize(this.info.get().size) + '</span>');
  },
  'progress': function() {
    return 'width:' + this.globalInfo.get().progress + '%';
  },
  buttonState: function() {
    var that = this;
    return {
      'idle': function () {
        return !that.globalInfo.get().running;
      },
      'cancelled': function () {
        return that.globalInfo.get().cancelled;
      },
      'waiting': function () {
        return that.globalInfo.get().progress !== 100;
      },
      'removeFromQueue': function() {
        return false;
      }
    }
  },
  'queueItems': function() {
    return this.queueView.get();
  },
  'showQueue': function() {
    return this.queueView.get().length > 1;
  }
});

Template['upload_bootstrap'].rendered = function () {
  Uploader.render.call(this);
};

