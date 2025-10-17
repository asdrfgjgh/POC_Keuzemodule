// Maak dit type ergens centraal aan (bijv. ~/server/types/api.ts)

import type { IUser } from '~/Backend/server/models/User'; // Of waar uw User interface is gedefinieerd

export interface FavoriteToggleResponse {
    message: string;
    user: IUser;
}