import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Miammi } from '../../public/notif/notif.model';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-miammi',
  imports: [CommonModule],
  templateUrl: './miammi.component.html',
  styleUrls: ['./miammi.component.scss'],
})
export class MiammiComponent implements OnInit, OnDestroy {
  message: Miammi[] = [];
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService
      .getMiami()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (menuData: Miammi[]) => {
          this.message = menuData.sort((a, b) => b.id - a.id);
          this.message.forEach((msg) => {
            msg.message = msg.message.replace(/\n/g, '<br>');
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
  }

  deleteMessage(id: number) {
    this.apiService
      .deletemessage(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.apiService
            .getMiami()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (msgData: Miammi[]) => {
                this.message = msgData.sort((a, b) => b.id - a.id);
                this.message.forEach((msg) => {
                  msg.message = msg.message.replace(/\n/g, '<br>');
                });
              },
              (error) => {
                console.error(
                  'Erreur lors de la récupération des messages:',
                  error
                );
              }
            );
        },
        (error) => {
          console.error('Erreur lors de la suppression du message:', error);
        }
      );
  }

  deleteAllMessages() {
    this.apiService
      .deleteallmessage()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.apiService.getMiami().pipe(takeUntil(this.destroy$))
        )
      )
      .subscribe(
        (msgData: Miammi[]) => {
          this.message = msgData.sort((a, b) => b.id - a.id);
          this.message.forEach((msg) => {
            msg.message = msg.message.replace(/\n/g, '<br>');
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération des messages:', error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
