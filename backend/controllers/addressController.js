// backend/controllers/addressController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * GET /api/addresses
 * Returns list of addresses for authenticated user
 */
export async function listAddresses(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/addresses
 * Create a new address for user
 */
export async function createAddress(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      zipCode,
      isDefault,
    } = req.body;

    // validation (basic)
    if (!fullName || !phone || !addressLine1 || !city || !country || !zipCode) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    // If isDefault is true, clear other defaults in a transaction
    if (isDefault) {
      await prisma.$transaction([
        prisma.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        }),
      ]);
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        zipCode,
        isDefault: Boolean(isDefault),
      },
    });

    res.status(201).json({ address });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/addresses/:id
 */
export async function getAddress(req, res, next) {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);
    const address = await prisma.address.findUnique({ where: { id } });

    if (!address || address.userId !== userId) return res.status(404).json({ message: 'Not found' });
    res.json({ address });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/addresses/:id
 */
export async function updateAddress(req, res, next) {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);
    const body = req.body;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Not found' });

    // if setting default, clear other defaults
    if (body.isDefault) {
      await prisma.$transaction([
        prisma.address.updateMany({
          where: { userId, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        }),
      ]);
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        fullName: body.fullName ?? existing.fullName,
        phone: body.phone ?? existing.phone,
        addressLine1: body.addressLine1 ?? existing.addressLine1,
        addressLine2: body.addressLine2 ?? existing.addressLine2,
        city: body.city ?? existing.city,
        state: body.state ?? existing.state,
        country: body.country ?? existing.country,
        zipCode: body.zipCode ?? existing.zipCode,
        isDefault: typeof body.isDefault === 'boolean' ? body.isDefault : existing.isDefault,
      },
    });

    res.json({ address: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/addresses/:id
 */
export async function deleteAddress(req, res, next) {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) return res.status(404).json({ message: 'Not found' });

    await prisma.address.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/addresses/:id/set-default
 */
export async function setDefaultAddress(req, res, next) {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);

    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) return res.status(404).json({ message: 'Not found' });

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);

    const updated = await prisma.address.findUnique({ where: { id } });
    res.json({ address: updated });
  } catch (err) {
    next(err);
  }
}
