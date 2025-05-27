import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ConversationDto {
  id: number;
  itemId: number;
  itemTitle: string;
  participantIds: number[];
  participantUsernames: string[];
  createdAt: string;
  updatedAt: string;
  lastMessageContent?: string;
  lastMessageTimestamp?: string;
  lastMessageSenderId?: number;
  lastMessageSenderUsername?: string;
}

export interface CreateConversationRequestDto {
  itemId: number;
  initiatorId: number;
  initialMessageContent: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private readonly apiUrl = `${environment.apiUrl}/conversations`;

  constructor(private http: HttpClient) {}

  createConversation(createDto: CreateConversationRequestDto): Observable<ConversationDto> {
    return this.http.post<ConversationDto>(this.apiUrl, createDto);
  }

  getConversationById(conversationId: number): Observable<ConversationDto> {
    return this.http.get<ConversationDto>(`${this.apiUrl}/${conversationId}`);
  }

  getConversationsForUser(userId: number): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.apiUrl}/users/${userId}`);
  }
}
