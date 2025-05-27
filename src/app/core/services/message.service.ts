import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MessageDto {
  id: number;
  content: string;
  timestamp: string;
  senderId: number;
  senderUsername: string;
  conversationId: number;
  isRead: boolean;
}

export interface CreateMessageRequestDto {
  content: string;
  senderId: number;
  conversationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(createMessageDto: CreateMessageRequestDto): Observable<MessageDto> {
    return this.http.post<MessageDto>(
      `${this.baseApiUrl}/conversations/${createMessageDto.conversationId}/messages`,
      createMessageDto
    );
  }

  markAllMessagesAsRead(conversationId: number, readerId: number): Observable<MessageDto[]> {
    return this.http.put<MessageDto[]>(
      `${this.baseApiUrl}/conversations/${conversationId}/messages/mark-as-read`,
      null,
      { params: { readerId: readerId.toString() } }
    );
  }
}
