
import { MatPaginatorIntl } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    constructor() {
        super();

        this.getAndInitTranslations();
    }

    getAndInitTranslations() {

        this.itemsPerPageLabel = 'Elementów na stronie';
        this.nextPageLabel = 'Następna strona';
        this.previousPageLabel = 'Poprzednia strona';
        this.firstPageLabel = 'Pierwsza strona';
        this.lastPageLabel = 'Ostatnia strona';
        this.changes.next();

    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 z ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} z ${length}`;
    }
}
