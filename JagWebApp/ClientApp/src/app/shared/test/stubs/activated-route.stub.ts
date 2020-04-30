import { Params } from '@angular/router';
import { Observable } from 'rxjs';

export const activatedRouteStub = {
    snapshot: {
        params: {
            id: '1',
            item: 'mainitem'
        },
        routeConfig: {
            path: 'admin/dishes/edit/1'
        }
    },
    queryParams: new Observable<Params>()
};
