import { Component, Input } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  description: any;
  amount: any;
  constructor(public photoService: PhotoService, private storage: Storage) {}

  public expenseContentList: {
    id: Number;
    dateTime: String;
    description: String;
    amount: Number;
    picture: String;
  }[] = [];

  async ngOnInit() {
    if (this.photoService.photos) {
      await this.photoService.loadSaved();
    }

    //start up and refrsh actions
    this.expenseContentList = []; //empty the array that displays.
    await this.storage.create();
    //refill the array from storage.

    this.storage.forEach((value) => {
      const expenseItem = {
        id: Math.random(),
        dateTime: value.dateTime,
        description: value.description,
        amount: value.amount,
        picture: value.picture,
      };
      this.expenseContentList.push(expenseItem);
    });
  }

  //clearAll button for testing only...needs refresh after.
  async clearAll() {
    await this.storage.clear();
    for (let photo of this.photoService.photos) {
      await this.photoService.deletePicture(photo, 0);
    }
    this.expenseContentList = [];
  }

  isModalOpen = false; //state value for open expense input modal

  async submitExpense() {
    //on clicking the submit button
    await this.storage.set('expense' + Math.random(), {
      dateTime: Date(),
      description: this.description,
      amount: this.amount,
      picture: this.photoService.photos[0].webviewPath,
    });

    this.expenseContentList = []; //clear the array for display again.

    //refill the array from storage, therefore only shows what is currently in storage.
    this.storage.forEach((value) => {
      const expenseItem = {
        id: value.id,
        dateTime: value.dateTime,
        description: value.description,
        amount: value.amount,
        picture: value.picture,
      };
      this.expenseContentList.push(expenseItem);
    });

    this.isModalOpen = false; //close the form
  }

  //initiate the form modal when FAB clicked.
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Share',
      data: {
        action: 'share',
      },
    },

    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
