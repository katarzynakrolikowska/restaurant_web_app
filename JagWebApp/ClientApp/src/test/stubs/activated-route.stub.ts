import { Observable } from 'rxjs';
import { Params } from '@angular/router';

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
