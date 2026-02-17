import { Router } from 'express';
import {getAllData, getDataById, addData, updateData, deleteDataById, getUsersRecords} from '../db/mongodb.js';
let router = Router()

router.get('/', async (req, res) => {
    res.json( await getAllData() )
})

router.get('/user_records', async (req, res) => {
    res.json( await getUsersRecords() )
})

router.get('/:id', async (req, res) => {
    res.json( await getDataById(req.params.id) )
})

router.post('/', async (req, res) => {
    let exist = await getDataById(req.body.id)
    if( exist ) {
        res.status(409).json( {"error": "record already exists"});
    } else {
        let result = await addData(req.body);
        if(result)
            res.json(req.body);
        else
            res.status(500).json({"error": "unknown database error"})
    }
})

router.put('/:id', async (req, res) => {
    let exist = await getDataById(req.params.id);

    if (!exist) {
        return res.status(404).json({ error: "record not found" });
    }

    try {
        await updateData(req.params.id, req.body);
        res.json({ message: "record updated", id: req.params.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "database error" });
    }
});

router.delete('/:id', async (req, res) => {
    let exist = await getDataById(req.params.id);

    if (!exist) {
        return res.status(404).json({ error: "record not found" });
    }

    try {
        await deleteDataById(req.params.id);
        res.json({ message: "record deleted", id: req.params.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "database error" });
    }
});

export default router;
